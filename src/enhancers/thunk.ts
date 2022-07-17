import type { EnhancedStore, EnhancerNext } from "../type";

type ThunkFn<S, E, R> = (store: EnhancedStore<S, E>) => R;

export type Ext<R> = {
  run: () => R;
};

export const thunk =
  <State, PreExt, Return>(
    thunkFn: ThunkFn<State, PreExt, Return>
  ): EnhancerNext<State, PreExt, Ext<Return>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    const run = () => thunkFn(store);

    return {
      ...store,
      run,
    };
  };
