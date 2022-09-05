# 可选的增强器

## immer

`immer()`

immer 增强器可以更方便地更新 state，它会给 store 增加一个 produce 方法，可以通过直接修改值来更新数据

用法

```js
import { createStore } from 'nice-store';
import { immer } from 'nice-store/enhancers';

const store = createStore({ a: 1, b: 2 }, immer());

// 订阅state更新事件
store.subscribe(console.log);

store.produce((s) => {
  s.a = 3;
});
```

## requestCache

`requestCache()`

requestCache 增强器会给 store 添加一个 withCache 方法，调用 withCache 会返回一个 options 对象，在 ahooks 的 useRequest 配置项中使用该对象，可以将请求的数据缓存到 store 中

用法

```js
import { createStore } from 'nice-store';
import { requestCache } from 'nice-store/enhancers';
import { useRequest } from 'ahooks';

const store = createStore(0, requestCache());

// 订阅state更新事件
store.subscribe(console.log);

useRequest(() => Promise.resolve(1), store.withCache());
```

## rx

`rx(...operators)`

rx 增强器会给 store 添加 next 方法，调用 next 方法会走所有的 rxjs 的操作符，最终更新 store 的状态

```js
import { createStore } from 'nice-store';
import { rx } from 'nice-store/enhancers';
import { map, scan } from 'rxjs/operators';

const store = createStore(
  0,
  rx(
    map((v: string) => Number(v)),
    scan((acc, v) => acc + v)
  )
);

// 订阅state更新事件
store.subscribe(console.log);

store.next('1'); // log 1
store.next('2'); // log 3
```
