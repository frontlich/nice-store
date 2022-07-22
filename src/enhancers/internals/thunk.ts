import { checkStore } from '../../utils';
import type { EnhancedStore, NextEnhancer } from '../../type';

type ThunkFn<S, E, R> = (store: EnhancedStore<S, E>) => R;

export type Ext<R> = {
  run: () => R;
};

export const thunk =
  <State, PreExt, Return>(
    thunkFn: ThunkFn<State, PreExt, Return>
  ): NextEnhancer<State, PreExt, Ext<Return>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'thunk', 'run');
    }

    const run = () => thunkFn(store);

    return {
      ...store,
      run,
    };
  };
