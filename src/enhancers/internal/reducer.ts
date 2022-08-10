import { checkStore } from '../../utils';
import type { NextEnhancer } from '../../type';

type Reducer<S, A> = (state: S, action: A) => S;

type Dispatch<A> = (action: A) => A;

type Ext<A> = {
  dispatch: Dispatch<A>;
};

export const reducer =
  <State, Action, PreExt>(
    reducerFn: Reducer<State, Action>
  ): NextEnhancer<State, PreExt, Ext<Action>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'reducer', 'dispatch');
    }

    const dispatch: Dispatch<Action> = (action) => {
      const state = reducerFn(store.getState(), action);
      store.setState(state);
      return action;
    };

    return {
      ...store,
      dispatch,
    };
  };
