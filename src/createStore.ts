import { createCoreStore } from './createCoreStore';
import { pipeFromArray } from './utils';
import type { Store, Enhancer, EnhancedStore, NextEnhancer } from './type';

export function createStore<State>(): Store<State>;

export function createStore<State>(initialState: State): Store<State>;

export function createStore<State, Ext = {}>(
  initialState: State,
  enhancer: Enhancer<State, Ext>,
): EnhancedStore<State, Ext>;

export function createStore<State, Ext1 = {}, Ext2 = {}>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
): EnhancedStore<State, Ext1 & Ext2>;

export function createStore<State, Ext1 = {}, Ext2 = {}, Ext3 = {}>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
): EnhancedStore<State, Ext1 & Ext2 & Ext3>;

export function createStore<State, Ext1 = {}, Ext2 = {}, Ext3 = {}, Ext4 = {}>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4>;

export function createStore<State, Ext1 = {}, Ext2 = {}, Ext3 = {}, Ext4 = {}, Ext5 = {}>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5>;

export function createStore<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {},
  Ext6 = {},
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6>;

export function createStore<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {},
  Ext6 = {},
  Ext7 = {},
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
  enhancer7: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6, Ext7>,
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7>;

export function createStore<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {},
  Ext6 = {},
  Ext7 = {},
  Ext8 = {},
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
  enhancer7: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6, Ext7>,
  enhancer8: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7, Ext8>,
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7 & Ext8>;

export function createStore<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {},
  Ext6 = {},
  Ext7 = {},
  Ext8 = {},
  Ext9 = {},
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
  enhancer7: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6, Ext7>,
  enhancer8: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7, Ext8>,
  enhancer9: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7 & Ext8, Ext9>,
): EnhancedStore<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7 & Ext8 & Ext9>;

export function createStore<State>(initialState?: State, ...enhancers: Enhancer<State, any>[]) {
  const finalCreateStore = pipeFromArray(enhancers)(createCoreStore);
  return finalCreateStore(initialState);
}
