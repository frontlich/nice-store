import { isFunction } from '../../utils';
import type { EnhancedStore, NextEnhancer } from '../../type';
import type { AnyAction, Ext as ReducerExt } from './reducer';

type ThunkFn<S, E> = (store: EnhancedStore<S, E>) => unknown;

export type Ext<S, E> = {
  dispatch: <A extends ThunkFn<S, E>>(fn: A) => ReturnType<A>;
};

export function thunk<State, PreExt>(): NextEnhancer<State, PreExt, Ext<State, PreExt>>;
export function thunk<
  State,
  Action extends AnyAction,
  PreExt extends ReducerExt<Action>,
>(): NextEnhancer<State, PreExt, Ext<State, PreExt>> {
  return (createStore) => (initialState) => {
    const store = createStore(initialState);

    const dispatch = (action: Action | ThunkFn<State, PreExt>) => {
      if (isFunction(action)) {
        return action(store);
      }
      if (process.env.NODE_ENV !== 'production' && !isFunction(store.dispatch)) {
        throw new Error(
          'if action is not a function, thunk enhancer must used after reducer enhancer',
        );
      }
      return store.dispatch(action);
    };

    return {
      ...store,
      dispatch,
    };
  };
}
