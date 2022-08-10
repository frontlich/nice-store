import { create } from '../../react';
import { checkStore, isFunction } from '../../utils';
import type { NextEnhancer } from '../../type';
import type { Ext as TakeExt } from './takeLatest';

type Ext = {
  useLoading: () => boolean;
};

export const takeLatestLoading =
  <
    State,
    Params,
    Return,
    PreExt extends TakeExt<Params, Return>
  >(): NextEnhancer<State, PreExt, Ext> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'takeLatestLoading', 'useLoading');
    }

    if (process.env.NODE_ENV !== 'production' && !isFunction(store.send)) {
      throw new Error(
        'takeLatestLoading enhancer must use after takeLatest enhancer'
      );
    }

    const { setState, useSelector } = create(false);

    const send = (p: Params) => {
      setState(true);
      store.send(p).finally(() => setState(false));
    };

    return {
      ...store,
      send,
      useLoading: useSelector,
    };
  };
