import { checkStore } from '../../utils';
import type { EnhancedStore, NextEnhancer } from '../../type';

export type Ext<P, R> = {
  runAsync: (p: P) => Promise<R>;
};

export type AsyncType = 'takeLatest' | 'takeEvery';

let defaultOverdueError: unknown = 'overdue';

export const setOverdueError = (error: unknown) => {
  defaultOverdueError = error;
};

/**
 * 异步设置状态
 * @param asyncFn 异步函数，需要返回值是Promise\<State\>
 * @param type 异步设置状态的方式，有 takeLatest(默认) 和 takeEvery
 * @param overdueError 请求过期时的错误信息
 * @returns Enhancer
 * @example
 * create(0, async((v: number, store) => new Promise(resolve => {
 *  setTimeout(() => {
 *    resolve(store.getState() + v);
 *  }, 1000)
 * })));
 *
 * store.runAsync(1); // after 1s store state is 1
 * store.runAsync(2); // after 1s store state is 3
 */
export const async =
  <State, PreExt, Params>(
    asyncFn: (params: Params, store: EnhancedStore<State, PreExt>) => Promise<State>,
    type: AsyncType = 'takeLatest',
    overdueError: unknown = defaultOverdueError,
  ): NextEnhancer<State, PreExt, Ext<Params, State>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'async', 'runAsync');
    }

    let id = 0;

    const runAsync = async (p: Params) => {
      id++;
      const curId = id;

      const res = await asyncFn(p, store);

      if (type === 'takeLatest') {
        if (curId === id) {
          store.setState(res);
        } else {
          return Promise.reject(overdueError);
        }
      } else {
        store.setState(res);
      }

      return res;
    };

    return {
      ...store,
      runAsync,
    };
  };
