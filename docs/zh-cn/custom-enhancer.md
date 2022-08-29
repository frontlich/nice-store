# 自定义增强器

如果内置的一些增强器不满足需求，我们还可以自定义增强器

自定义增强器既可以是定义新的增强器，也可以是组合现有的增强器

## 定义新的增强器

```ts
export type EnhancedStore<State, Ext> = Store<State> & Ext;

export type CreateStore<S, Ext> = (initialState?: S) => EnhancedStore<S, Ext>;

export type NextEnhancer<S, Ext1, Ext2 = Ext1> = (
  createStore: CreateStore<S, Ext1>
) => CreateStore<S, Ext1 & Ext2>;
```

一个 Enhancer 是一个形如`(createStore) => (initialState) => store`的函数

举例：

```js
export const logger = (createStore) => (initialState) => {
  const store = createStore();

  const setState = (update) => {
    if (typeof update === "function") {
      store.setState((state) => {
        const newState = update(state);
        console.log("log from logger enhancer:", newState);
        return newState;
      });
    } else {
      console.log("log from logger enhancer:", update);
      store.setState(update);
    }
  };

  return {
    ...store,
    setState,
  };
};
```

## 组合现有的增强器

```js
import { pipe, reset, thunk } from "nice-store";
export const myEnhancer = pipe(reset(), thunk());
```
