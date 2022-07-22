import { useLayoutEffect, useState } from 'react';

import { createCoreStore } from '../../createCoreStore';
import { checkStore, isFunction } from '../../utils';
import type { NextEnhancer } from '../../type';
import type { Ext as ThunkExt } from './thunk';

type Ext = {
  useLoading: () => boolean;
};

export const thunkLoading =
  <
    State,
    Return extends Promise<unknown>,
    PreExt extends ThunkExt<Return>
  >(): NextEnhancer<State, PreExt, Ext> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'thunkLoading', 'useLoading');
    }

    if (process.env.NODE_ENV !== 'production' && !isFunction(store.run)) {
      throw new Error('thunkLoading enhancer must use after thunk enhancer');
    }

    const { setState, subscribe } = createCoreStore(false);

    const run = () => {
      setState(true);
      store.run().finally(() => setState(false));
    };

    const useLoading = () => {
      const [loading, setLoading] = useState(false);

      useLayoutEffect(() => subscribe(setLoading), []);

      return loading;
    };

    return {
      ...store,
      run,
      useLoading,
    };
  };
