import { checkStore } from '../../utils';
import type { NextEnhancer } from '../../type';

type Ext = {
  resetState: () => void;
};

export const reset =
  <State, PreExt>(): NextEnhancer<State, PreExt, Ext> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'reset', 'resetState');
    }

    return {
      ...store,
      resetState: () => store.setState(initialState!),
    };
  };
