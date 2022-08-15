import { create } from '../../react';
import { checkStore, isFunction } from '../../utils';
import type { NextEnhancer } from '../../type';
import type { Ext as AsyncExt } from './async';

type Ext = {
  useLoading: () => boolean;
  useLoadingMap: () => Record<number, boolean>;
};

export const asyncLoading =
  <State, Params, PreExt extends AsyncExt<Params, State>>(): NextEnhancer<
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

    const runAsync = (p: Params) => {
      const id = (store as any).__getCurrentAsyncId();
      curId = id;
      setLoading(id, false);
      const res = store.runAsync(p);
      res.finally(() => setLoading(id, true));
      return res;
    };

    return {
      ...store,
      runAsync,
      useLoading: () => {
        const loadingMap = useSelector();
        return !!loadingMap[curId];
      },
      useLoadingMap: useSelector,
    };
  };
