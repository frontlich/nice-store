# 快速上手

## 安装

使用 npm、yarn、cnpm 或者 pnpm，取决于你，这里以 npm 为例

`npm install nice-store --save`

## 使用

- **createCoreStore**（创建核心 store）

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

上面我们通过 `createCoreStore` 函数，创建了一个最简单的 store，它只有四个方法

1. setState：设置/更新状态
2. getState：获取最新状态
3. subscribe：添加监听状态更新的函数
4. freeze：冻结状态并销毁所有监听

这完成了一个状态的发布订阅的最基本实现。但这对于我们复杂的应用来说，功能还不够强大，下面让我们来增强一下这个 store

- **createStore**（创建可增强的 store）

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

大多数情况下，只有上面那个最简单的 store 是不够用的，`createStore` 函数提供了增强 store 的能力，函数的第二个及以后的参数，需要传入增强器，nice-store 内置了一些常用的增强器，同时你也可以[自定义增强器](/zh-cn/custom-enhancer?id=自定义增强器)。

增强后的 store，通常会附加一些有用的方法或状态，可以让我们更方便的使用 store。

- **create**（内置选择器的 store）

如何将 store 应用到 react 组件呢？有两种方法：

1. 使用 selectorHook 增强器创建 store
2. 使用 create 方法创建 store

创建后的 store 自带 useSelector hook，可以直接在函数式组建内使用

```js
// store.js
import create, { createStore, selectorHook } from 'nice-store';

// 创建一个使用 selectorHook 增强的 store
export const store = createStore({ count: 0 }, selectorHook());

// or

// create 内置了 selectorHook 增强器
export const store = create({ count: 0 });
```

事实上，`create` 函数是内置了 selectorHook 增强器的一个函数。

- **使用 hook**

```js
// Counter.jsx
import { store } from './store';

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
      <button onClick={() => store.resetState}>reset</button>
    </div>
  );
};
```

useSelector 函数，支持传入两个参数：

1. 选择器函数，支持从 state 中选择想要的状态
2. 比较函数，默认内置的是一个浅比较函数，用于判断选择器函数返回的状态是否变化，正确使用可减少 render 次数

以上是最基本的一些用法，觉得功能不够丰富？请参考[增强器](/zh-cn/internal-enhancer?id=内置的增强器)这章，找到你喜欢的管理 state 的各种姿势！
