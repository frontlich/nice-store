import { useDebugValue } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

import { createStore } from './createStore';
import { defaultSelector, shallowEqual } from './utils';
import type {
  Selector,
  UseStore,
  Store,
  Enhancer,
  EnhancedStore,
  EnhancerNext,
} from './type';

type ExtractState<T> = T extends { getState: () => infer S } ? S : never;

type Result<S, E = {}> = [
  UseStore<ExtractState<EnhancedStore<S, E>>>,
  EnhancedStore<S, E>
];

export function withStore<S extends Store<any>>(store: S) {
  const useStore = <Slice>(
    selector: Selector<ExtractState<S>, Slice> = defaultSelector,
    isEqual: (pre: Slice, cur: Slice) => boolean = shallowEqual
  ) => {
    const slice = useSyncExternalStoreWithSelector(
      store.subscribe,
      store.getState,
      null,
      selector,
      isEqual
    );

    useDebugValue(slice);

    return slice;
  };

  return useStore;
}

export function create<State>(): [
  UseStore<State | undefined>,
  Store<State | undefined>
];

export function create<State>(initialState: State): Result<State>;

export function create<State, Ext>(
  initialState: State,
  enhancer: Enhancer<State, Ext>
): Result<State, Ext>;

export function create<State, Ext1, Ext2>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>
): Result<State, Ext1 & Ext2>;

export function create<State, Ext1, Ext2, Ext3>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>
): Result<State, Ext1 & Ext2 & Ext3>;

export function create<State, Ext1, Ext2, Ext3, Ext4>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4>;

export function create<State, Ext1, Ext2, Ext3, Ext4, Ext5>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5>;

export function create<State, Ext1, Ext2, Ext3, Ext4, Ext5, Ext6>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6>;

export function create<State, Ext1, Ext2, Ext3, Ext4, Ext5, Ext6, Ext7>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
  enhancer7: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6, Ext7>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7>;

export function create<State>(
  initialState?: State,
  ...enhancers: Enhancer<State, any>[]
) {
  const store = (createStore as any)(initialState, ...enhancers);

  return [withStore(store), store];
}
