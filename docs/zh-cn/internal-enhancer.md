# 内置的增强器

## async

`async(asyncFn: (params, store) => Promise<State>, type?: 'takeLatest' | 'takeEvery')`

async 增强器可以用来处理异步的状态更新，它会给 store 增加一个 runAsync 方法，调用 runAsync 时， asyncFn 会执行并接受 runAsync 传入的参数，返回值会自动更新到 store 中。

1. asyncFn: 异步函数，在调用 runAsync 之后执行;
2. type: 更新状态的方式，默认是 `'takeLatest'`;

`'takeLatest'`: 连续调用 runAsync 时，如果上次未结束则舍弃，只取最后一次做更新
`'takeEvery'`: 连续调用 runAsync 时，使用每一次调用的结果进行更新

用法

```js
import { createStore, async } from "nice-store";

const store = createStore(
  0,
  async(
    (v) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(v);
        }, 1000);
      })
  )
);

// 订阅state更新事件
store.subscribe(console.log);

// 更新state
store.runAsync(1); // 因为type默认值为takeLatest，所以第一次调用被舍弃了
store.runAsync(2); // 1秒后store的state更新为2
```

## asyncLoading

`asyncLoading()`

asyncLoading 增强器用于获取 async 增强器的 asyncFn 的 loading 状态，它会给 store 添加 useLoading hook，可在函数组件中使用

用法

```js
import { createStore, async, asyncLoading } from "nice-store";

const store = createStore(
  0,
  async(
    (v) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(v);
        }, 1000);
      })
  ),
  asyncLoading()
);

// 订阅state更新事件
store.subscribe(console.log);

// 更新state
store.runAsync(1);

// 在组件中使用hook可获取loading状态
const loading = store.useLoading();
```

## connect

`connect(...stores, mapStateToState?: (...storeStates) => NewState)`

connect 增强器用于连接其它的 store，获得其它 store 状态及订阅状态的变更

用法

```js
import { createStore, connect } from "nice-store";

const store1 = createStore({ name: "Tom" });

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
store1.setState({ name: "Jarry" });
store2.setState({ age: 12 });
store.setState({ count: 1 });
```

connect 函数可接收多个 store，最后一个参数用于组合所有 store 中的状态，如果最后一个参数不是函数，则其它 store 的状态都会被合并到此 store 中

## reducer

`reducer(reducerFn: (state, action) => State)`

如果你熟悉 redux，这个增强器的使用非常容易理解

reducer 增强器，接收一个 reducerFn 函数作为参数，它会给 store 增加一个 dispatch 方法，调用 dispatch 方法，reducerFn 函数执行并接收 dispatch 传入的 action，返回新的 state 之后进行更新

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

## reset

`reset()`

reset 增强器会给 store 增加一个 resetState 方法，调用 resetState 会重置 store 的状态为初始值

用法

```js
import { createStore, reset } from "nice-store";

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

`selectorHook()`

selectorHook 增强器会给 store 增加一个 useSelector hook，使用该 hook 可以直接在函数组件内获取到 store 中的状态

用法

```js
import { createStore, selectorHook } from "nice-store";

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

## task

`task(taskFn: (store, ...args) => CancelFn | void, autoRun?: boolean)`;

task 增强器可以用来执行一些特定任务，比如倒计时之类的自动更新 store 的状态，它接收如下两个参数并会给 store 添加 runTask 和 cancelTask 两个方法

1. taskFn: 任务函数
2. autoRun: 是否自动执行任务函数，默认 true

用法

```js
import { createStore, task } from "nice-store";

const store = createStore(
  0,
  task((store) => {
    const timer = setInterval(() => {
      store.setState((v) => v + 1);
    }, 1000);
    return () => clearInterval(timer);
  })
);

// 订阅state更新事件
store.subscribe(console.log); // 每隔1秒输出一次
```

## thunk

`thunk()`

thunk 增强器可以用来处理异步的状态更新，它会给 store 增加一个 dispatch 方法，该方法接收一个函数作为参数，调用 dispatch 时， 传入的函数会执行并可以在适当的时机更新状态。

如果在 thunk 之前使用了 reducer 增强器，那么它会修改 store 的 dispatch 方法，使 dispatch 支持传入函数作为参数

用法

```js
import create, { thunk } from "nice-store";

const countStore = create({ count: 0 }, thunk());

const thunkAdd = (store) => {
  setTimeout(() => {
    store.setState((state) => ({ count: state.count + 1 }));
  }, 1000);
};

const Counter = () => {
  const count = countStore.useSelector((state) => state.count);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => countStore.dispatch(thunkAdd)}>async add</button>
    </div>
  );
};
```
