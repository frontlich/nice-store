import { create } from '../../react';
import { checkStore, isFunction } from '../../utils';
import type { NextEnhancer } from '../../type';
import type { AsyncType, Ext as AsyncExt } from './async';

type Ext = {
  useLoading: (type?: AsyncType) => boolean;
};

export const asyncLoading =
  <State, PreExt extends AsyncExt<any, State>>(): NextEnhancer<
    State,
    PreExt,
    Ext
  > =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'asyncLoading', 'useLoading', 'useLoadingMap');
    }

    if (process.env.NODE_ENV !== 'production' && !isFunction(store.runAsync)) {
      throw new Error('asyncLoading enhancer must use after async enhancer');
    }

    const { setState, useSelector } = create<Record<number, boolean>>({});

    const setLoading = (id: number, status: boolean) => {
      setState((map) => ({ ...map, [id]: status }));
    };

    let curId: number;

    const runAsync = (p: unknown) => {
      const id = (store as any).__getCurrentAsyncId();
      curId = id;
      setLoading(id, true);
      const res = store.runAsync(p);
      res.finally(() => setLoading(id, false));
      return res;
    };

    const useLoading = (type?: AsyncType) => {
      const loadingMap = useSelector();

      if (type === 'takeEvery') {
        for (const key in loadingMap) {
          if (loadingMap[key]) {
            return true;
          }
        }
        return false;
      }

      return !!loadingMap[curId];
    };

    return {
      ...store,
      runAsync,
      useLoading,
    };
  };
