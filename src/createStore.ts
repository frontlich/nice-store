import { createCoreStore } from './createCoreStore';
import { pipeFromArray } from './utils';
import type { Store, Enhancer, EnhancedStore, EnhancerNext } from './type';

export function createStore<State>(): Store<State>;

export function createStore<State>(initialState: State): Store<State>;

export function createStore<State, Ext>(
  initialState: State,
  enhancer: Enhancer<State, Ext>
): EnhancedStore<State, Ext>;

export function createStore<State, Ext1, Ext2>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>
): EnhancedStore<State, Ext1 & Ext2>;

export function createStore<State, Ext1, Ext2, Ext3>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>
): EnhancedStore<State, Ext1 & Ext2 & Ext3>;

export function createStore<State, Ext1, Ext2, Ext3, Ext4>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4>;

export function createStore<State, Ext1, Ext2, Ext3, Ext4, Ext5>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5>;

export function createStore<State, Ext1, Ext2, Ext3, Ext4, Ext5, Ext6>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6>;

export function createStore<State, Ext1, Ext2, Ext3, Ext4, Ext5, Ext6, Ext7>(
  initialState: State,
  enhancer: Enhancer<State, Ext1>,
  enhancer2: EnhancerNext<State, Ext1, Ext2>,
  enhancer3: EnhancerNext<State, Ext1 & Ext2, Ext3>,
  enhancer4: EnhancerNext<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
  enhancer7: EnhancerNext<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6, Ext7>
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7>;

export function createStore<State>(
  initialState?: State,
  ...enhancers: Enhancer<State, any>[]
) {
  const createStore = pipeFromArray(enhancers)(createCoreStore);
  return createStore(initialState);
}
