import { useDebugValue } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

import { checkStore, defaultSelector, shallowEqual } from '../../utils';
import type { NextEnhancer, Selector } from '../../type';

type Ext<State> = {
  useSelector: <Slice>(
    selector?: Selector<State, Slice>,
    isEqual?: (pre: Slice, cur: Slice) => boolean
  ) => Slice;
};

type ExtractState<T> = T extends { getState: () => infer S } ? S : never;

export const selectorHook =
  <State, PreExt>(): NextEnhancer<State, PreExt, Ext<ExtractState<PreExt>>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'selectorHook', 'useSelector');
    }

    const useSelector = <Slice>(
      selector: Selector<ExtractState<PreExt>, Slice> = defaultSelector,
      isEqual: (pre: Slice, cur: Slice) => boolean = shallowEqual
    ) => {
      const slice = useSyncExternalStoreWithSelector(
        store.subscribe,
        store.getState as () => ExtractState<PreExt>,
        null,
        selector,
        isEqual
      );

      useDebugValue(slice);

      return slice;
    };

    return {
      ...store,
      useSelector,
    };
  };
