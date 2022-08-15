# 内置的增强器

## connect

connect 增强器用于连接其它的 store，获得其它 store 状态及订阅状态的变更

用法

```js
import { createStore, connect } from 'nice-store';

const store1 = createStore({ name: 'Tom' });

const store2 = createStore({ age: 18 });

// 创建store的时候，使用 reset 函数增强store，得到的 store 会自动添加 resetState 方法
const store = createStore(
  { count: 0 },
  connect(store1, store2, (state1, state2) => ({
    userInfo: { name: state1.name, age: state2.age },
  }))
);

// 订阅state更新事件
store.subscribe(console.log);

// 更新state
store1.setState({ name: 'Jarry' });
store2.setState({ age: 12 });
store.setState({ count: 1 });
```

connect 函数可接收多个 store，最后一个参数用于组合所有 store 中的状态，如果最后一个参数不是函数，则其它 store 的状态都会被合并到此 store 中

## reducer

如果你熟悉 redux，这个增强器的使用非常容易理解

用法

```js
import { createStore, reducer } from 'nice-store';

// 创建store的时候，使用 reset 函数增强store，得到的 store 会自动添加 resetState 方法
const store = createStore(
  { count: 0 },
  reducer((state, action: 'ADD' | 'REDUCE') => {
    switch(action) {
      case 'ADD':
        return {count: state.count + 1};
      case 'REDUCE':
        return {count: state.count - 1};
      default
        return state;
    }
  })
);

// 订阅state更新事件
store.subscribe(console.log);

// 更新state
store.dispatch('ADD');
```

reducer 增强器接收一个 "reducer" 函数作为参数，它会给 store 增加一个 dispatch 方法，调用 dispatch 会执行增强器的 "reducer" 参数，并根据返回值更新 state

## reset

reset 增强器会给 store 增加一个 resetState 方法，调用 resetState 会重置 store 的状态为初始值

用法

```js
import { createStore, reset } from 'nice-store';

// 创建store的时候，使用 reset 函数增强store，得到的 store 会自动添加 resetState 方法
const store = createStore({ count: 0 }, reset());

// 订阅state更新事件
store.subscribe(console.log);

// 更新state
store.setState({ count: 1 });

// 重置回初始值
store.resetState();
```

## selectorHook

selectorHook 增强器会给 store 增加一个 useSelector hook，使用该 hook 可以直接在函数组件内获取到 store 中的状态

用法

```js
import { createStore, selectorHook } from 'nice-store';

// 创建一个使用 selectorHook 增强的 store
const store = createStore({ count: 0 }, selectorHook());

const Counter = () => {
  const count = store.useSelector((state) => state.count);

  return (
    <div>
      <div>{count}</div>
      <button
        onClick={() => store.setState((state) => ({ count: state.count + 1 }))}
      >
        add
      </button>
    </div>
  );
};
```

store.useSelector 有两个参数：

1. 选择器函数，用于从 state 中选择想要的状态
2. 比较函数，用于比较选择的状态是否一致，用来减少渲染次数，默认的比较函数是浅比较

create 函数内置了 selectorHook 增强器

## thunk

thunk 增强器可以用来处理异步的状态更新，它会给 store 增加一个 dispatch 方法，该方法接收一个函数作为参数，调用 dispatch 时， 传入的函数会执行并可以在适当的时机更新状态。

如果在 thunk 之前使用了 reducer 增强器，那么它会修改 store 的 dispatch 方法，使 dispatch 支持传入函数作为参数

用法

```js
import create, { thunk } from 'nice-store';

const countStore = create({ count: 0 }, thunk());

const asyncAdd = (store) => {
  setTimeout(() => {
    store.setState((state) => ({ count: state.count + 1 }));
  }, 1000);
};

const Counter = () => {
  const count = countStore.useSelector((state) => state.count);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => countStore.dispatch(asyncAdd)}>async add</button>
    </div>
  );
};
```
