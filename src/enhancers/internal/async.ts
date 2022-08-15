import { checkStore } from '../../utils';
import type { NextEnhancer } from '../../type';

export type Ext<P, R> = {
  send: (p: P) => Promise<R>;
};

export const async =
  <State, PreExt, Params>(
    asyncFn: (params: Params) => Promise<State>,
    type: 'takeLatest' | 'takeEvery' = 'takeLatest'
  ): NextEnhancer<State, PreExt, Ext<Params, State>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'async', 'send');
    }

    let id = 0;

    const send = async (p: Params) => {
      id++;
      let curId = id;

      const res = await asyncFn(p);

      if (type === 'takeLatest') {
        if (curId === id) {
          store.setState(res);
        } else {
          return Promise.reject('overdue');
        }
      } else {
        store.setState(res);
      }

      return res;
    };

    return {
      ...store,
      send,
    };
  };
