import { checkStore } from '../../utils';
import type { NextEnhancer } from '../../type';

export type Ext<P, R> = {
  send: (p: P) => Promise<R>;
};

export const takeLatest =
  <State, PreExt, Params>(
    asyncFn: (params: Params) => Promise<State>
  ): NextEnhancer<State, PreExt, Ext<Params, State>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'takeLatest', 'send');
    }

    const send = (p: Params) =>
      asyncFn(p).then((res) => {
        store.setState(res);
        return res;
      });

    return {
      ...store,
      send,
    };
  };
