export type SetState<T> = (newState: T | ((preState: T) => T)) => void;

export type Listener<T> = (state: T) => void;

export type UnSubscribe = () => void;

export type Store<S> = {
  /** 设置新状态 */
  setState: SetState<S>;
  /** 获取最新状态 */
  getState: () => S;
  /** 订阅状态改变 */
  subscribe: (listener: Listener<S>) => UnSubscribe;
  /** 销毁所有订阅 */
  destroy: () => void;
};

export type EnhancedStore<State, Ext> = Store<State> & Ext;

export type CreateCoreStore<S> = (initialState?: S) => Store<S>;

export type CreateStore<S, Ext> = (initialState?: S) => EnhancedStore<S, Ext>;

export type Enhancer<S, Ext> = (
  createCoreStore: CreateCoreStore<S>
) => CreateStore<S, Ext>;

export type EnhancerNext<S, Ext1, Ext2 = Ext1> = (
  createStore: CreateStore<S, Ext1>
) => CreateStore<S, Ext1 & Ext2>;

export type Selector<State, Slice> = (state: State) => Slice;

export type UseStore<State> = <Slice = State>(
  selector?: Selector<State, Slice>,
  isEqual?: (pre: Slice, cur: Slice) => boolean
) => Slice;
