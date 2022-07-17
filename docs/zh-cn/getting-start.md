# 快速上手

## 安装

使用 npm、yarn、cnpm 或者 pnpm，取决于你，这里以 npm 为例

`npm install nice-store --save`

## 使用

- 核心 store

```js
import { createCoreStore } from 'nice-store';

// 首先传入一个 initialState，创建一个 store
const store = createCoreStore({ count: 0 });

// 订阅state更新事件
store.subscribe(console.log);

// 直接更新state
store.setState({ count: 1 });

// 通过函数更新state
store.setState((state) => ({ count: state.count + 1 }));
```

- 增强 store

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

- 与 react 结合

```js
// store.js
import create, { withStore, createStore, reset } from 'nice-store';

// 创建一个增强的 store
export const store = createStore({ count: 0 }, reset());
// 使用 withStore 连接 store
export const useStore = withStore(store);

// or

// create 整合了 createStore 和 withStore
export const [useStore, store] = create({ count: 0 }, reset());
```

- 使用 hook

```js
// Counter.jsx
import { useStore, store } from './store';

const Counter = () => {
  const count = useStore((state) => state.count);

  return (
    <div>
      <div>{count}</div>
      <button
        onClick={() => store.setState((state) => ({ count: state.count + 1 }))}
      >
        add
      </button>
      <button onClick={() => store.resetState}>reset</button>
    </div>
  );
};
```

以上是最基本的一些用法，觉得功能不够丰富？请参考[增强函数](/zh-cn/enhancer)这章，找到你喜欢的管理 state 的各种姿势！
