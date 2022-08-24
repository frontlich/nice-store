# nice-store

[![npm version](https://img.shields.io/npm/v/nice-store.svg)](https://www.npmjs.com/package/nice-store)
[![npm downloads](https://img.shields.io/npm/dm/nice-store.svg)](https://www.npmjs.com/package/nice-store)

## homepage

https://frontlich.github.io/nice-store/#/

## usage

### install

`npm install nice-store`

### createCoreStore

```js
import { createCoreStore } from "nice-store";

const store = createCoreStore(0);

store.subscribe(console.log);

store.setState(1); // will log 1
store.getState(); // 1
```

### createStore

```js
import { createStore } from "nice-store";
```

create enhanced store with initialState and enhancers

`createStore(initialState, ...enhancers);`

internal enhancers:

- [async(asyncFn, 'takeLatest' | 'takeEvery')](https://frontlich.github.io/nice-store/#/zh-cn/internal-enhancer?id=async)
- [asyncLoading()](https://frontlich.github.io/nice-store/#/zh-cn/internal-enhancer?id=asyncLoading)
- [connect(...otherStores)](https://frontlich.github.io/nice-store/#/zh-cn/internal-enhancer?id=connect)
- [reducer(reducerFn)](https://frontlich.github.io/nice-store/#/zh-cn/internal-enhancer?id=reducer)
- [reset()](https://frontlich.github.io/nice-store/#/zh-cn/internal-enhancer?id=reset)
- [selectorHook()](https://frontlich.github.io/nice-store/#/zh-cn/internal-enhancer?id=selectorhook)
- task(taskFn)
- [thunk(thunkFn)](https://frontlich.github.io/nice-store/#/zh-cn/internal-enhancer?id=thunk)

other enhancers:

- requestCache()
- rx(...operators)
