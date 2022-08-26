import immerProduce, { Draft } from 'immer';

import { checkStore } from '../utils';
import type { NextEnhancer } from '../type';

type Ext<S> = {
  produce: (recipe: (draft: Draft<S>) => void) => void;
};

export function immer<State, PreExt>(): NextEnhancer<State, PreExt, Ext<State>> {
  return (createStore) => (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'immer', 'produce');
    }

    return {
      ...store,
      produce: (recipe) => {
        store.setState((state) => immerProduce(state, (draft) => void recipe(draft)));
      },
    };
  };
}
