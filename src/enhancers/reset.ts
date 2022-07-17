import type { EnhancerNext } from '../type';

type Ext = {
  resetState: () => void;
};

export const reset =
  <State, PreExt>(): EnhancerNext<State, PreExt, Ext> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    return {
      ...store,
      resetState: () => store.setState(initialState!),
    };
  };
