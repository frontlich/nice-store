import { create } from '../../react';
import { checkStore, isFunction } from '../../utils';
import type { NextEnhancer } from '../../type';
import type { AsyncType, Ext as AsyncExt } from './async';

type Ext = {
  useLoading: (type?: AsyncType) => boolean;
};

export const asyncLoading =
  <State, PreExt extends AsyncExt<any, State>>(): NextEnhancer<State, PreExt, Ext> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'asyncLoading', 'useLoading');
    }

    if (process.env.NODE_ENV !== 'production' && !isFunction(store.runAsync)) {
      throw new Error('asyncLoading enhancer must use after async enhancer');
    }

    const { setState, useSelector } = create<Record<number, boolean>>({});

    const setLoading = (id: number, status: boolean) => {
      setState((map) => ({ ...map, [id]: status }));
    };

    let id = 0;

    const runAsync = (p: unknown) => {
      id++;
      const curId = id;

      setLoading(curId, true);

      return store.runAsync(p).finally(() => {
        setLoading(curId, false);
      });
    };

    const useLoading = (type: AsyncType = 'takeLatest') => {
      const loadingMap = useSelector();

      if (type === 'takeLatest') {
        return !!loadingMap[id];
      }

      for (const key in loadingMap) {
        if (loadingMap[key]) {
          return true;
        }
      }
      return false;
    };

    return {
      ...store,
      runAsync,
      useLoading,
    };
  };
