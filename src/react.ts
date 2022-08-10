import { createStore } from './createStore';
import { selectorHook } from './enhancers/internal/selectorHook';
import type { Enhancer, EnhancedStore, NextEnhancer, Selector } from './type';

type ExtractState<T> = T extends { getState: () => infer S } ? S : never;

type UseSelectorExt<State, Ext = {}> = {
  useSelector: <Slice = State>(
    selector?: Selector<ExtractState<EnhancedStore<State, Ext>>, Slice>,
    isEqual?: (pre: Slice, cur: Slice) => boolean
  ) => Slice;
};

type Result<State, Ext = {}> = EnhancedStore<
  State,
  UseSelectorExt<State, Ext> & Ext
>;

export function create<State>(): Result<State | undefined>;

export function create<State>(initialState: State): Result<State>;

export function create<State, Ext = {}>(
  initialState: State,
  enhancer: Enhancer<State, Ext>
): Result<State, Ext>;

export function create<State, Ext1 = {}, Ext2 = {}>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>
): Result<State, Ext1 & Ext2>;

export function create<State, Ext1 = {}, Ext2 = {}, Ext3 = {}>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>
): Result<State, Ext1 & Ext2 & Ext3>;

export function create<State, Ext1 = {}, Ext2 = {}, Ext3 = {}, Ext4 = {}>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4>;

export function create<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {}
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5>;

export function create<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {},
  Ext6 = {}
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6>;

export function create<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {},
  Ext6 = {},
  Ext7 = {}
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
  enhancer7: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6, Ext7>
): Result<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7>;

export function create<
  State,
  Ext1 = {},
  Ext2 = {},
  Ext3 = {},
  Ext4 = {},
  Ext5 = {},
  Ext6 = {},
  Ext7 = {},
  Ext8 = {}
>(
  initialState: State,
  enhancer1: Enhancer<State, Ext1>,
  enhancer2: NextEnhancer<State, Ext1, Ext2>,
  enhancer3: NextEnhancer<State, Ext1 & Ext2, Ext3>,
  enhancer4: NextEnhancer<State, Ext1 & Ext2 & Ext3, Ext4>,
  enhancer5: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4, Ext5>,
  enhancer6: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5, Ext6>,
  enhancer7: NextEnhancer<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6, Ext7>,
  enhancer8: NextEnhancer<
    State,
    Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7,
    Ext8
  >
): Result<State, Ext1 & Ext2 & Ext3 & Ext4 & Ext5 & Ext6 & Ext7 & Ext8>;

export function create<State>(
  initialState?: State,
  ...enhancers: Enhancer<State, any>[]
) {
  const store = (createStore as any)(
    initialState,
    ...enhancers,
    selectorHook()
  );

  return store;
}
