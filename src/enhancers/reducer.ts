import type { EnhancerNext } from "../type";

type Reducer<S, A> = (state: S, action: A) => S;

type Dispatch<A> = (action: A) => A;

type Ext<A> = {
  dispatch: Dispatch<A>;
};

export const reducer =
  <State, Action, PreExt>(
    reducerFn: Reducer<State, Action>
  ): EnhancerNext<State, PreExt, Ext<Action>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

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
