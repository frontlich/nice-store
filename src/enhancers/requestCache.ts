import type { Options } from 'ahooks/lib/useRequest/src/types';
import type { CachedData } from 'ahooks/lib/useRequest/src/utils/cache';

import { checkStore, isFunction } from '../utils';
import type { NextEnhancer } from '../type';

/** 剩余配置项 */
type RestOptions<D, P extends unknown[]> = Omit<
  Options<D, P>,
  'cacheKey' | 'getCache' | 'setCache' // 不再需要传的配置项
>;

interface Ext<S> {
  withCache<TData extends S, TParams extends unknown[]>(): Options<TData, TParams>;
  withCache<TData extends S, TParams extends unknown[]>(
    options: RestOptions<TData, TParams>,
  ): Options<TData, TParams>;
  withCache<TData, TParams extends unknown[]>(
    mapDataToState: (d: TData, p: TParams, s: S) => S,
  ): Options<TData, TParams>;
  withCache<TData, TParams extends unknown[]>(
    options: RestOptions<TData, TParams>,
    mapDataToState: (d: TData, p: TParams, s: S) => S,
  ): Options<TData, TParams>;
}

export const requestCache =
  <State, PreExt>(): NextEnhancer<State, PreExt, Ext<State>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'requestCache', 'withCache');
    }

    return {
      ...store,
      withCache: <TData, TParams extends unknown[]>(
        optionsOrMap?:
          | RestOptions<TData, TParams>
          | ((data: TData, params: TParams, preState: State) => State),
        mapDataToState?: (data: TData, params: TParams, preState: State) => State,
      ) => {
        const options = typeof optionsOrMap === 'object' ? optionsOrMap : {};
        const map2state = isFunction(mapDataToState)
          ? mapDataToState
          : isFunction(optionsOrMap)
          ? optionsOrMap
          : null;

        let time = 0;
        return {
          // 这里cacheKey即使重复了也没关系
          // 因为自定义setCache和getCache的情况下，不会用到cacheKey
          // 但不能没有cacheKey，因为cacheKey是开启缓存的判断条件
          cacheKey: '__$$key',
          getCache: (params: TParams) => {
            if (
              options.cacheTime &&
              options.cacheTime !== -1 &&
              Date.now() - time > options.cacheTime
            ) {
              // 如果当前时间 - 设置缓存时的时间 > cacheTime
              // 则不需要读取缓存
              return;
            }
            return {
              params,
              data: store.getState(),
              time,
            };
          },
          setCache: (data: CachedData<TData, TParams>) => {
            time = data.time;
            store.setState((preState) =>
              map2state
                ? map2state(data.data, data.params, preState)
                : (data.data as unknown as State),
            );
          },
          ...options,
        };
      },
    };
  };
