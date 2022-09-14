import type { NextEnhancer, Store, SetState } from '../../type';
import { isFunction } from '../../utils';

export type Ext<S> = {
  getState: () => S;
};

export function connect<State, PreExt, State1, FinalState = State1>(
  store1: Store<State1>,
  mapStateToState?: (state1: State1) => FinalState,
): NextEnhancer<State, PreExt, Ext<State & FinalState>>;

export function connect<State, PreExt, State1, State2, FinalState = State1 & State2>(
  store1: Store<State1>,
  store2: Store<State2>,
  mapStateToState?: (state1: State1, state2: State2) => FinalState,
): NextEnhancer<State, PreExt, Ext<State & FinalState>>;

export function connect<
  State,
  PreExt,
  State1,
  State2,
  State3,
  FinalState = State1 & State2 & State3,
>(
  store1: Store<State1>,
  store2: Store<State2>,
  store3: Store<State3>,
  mapStateToState?: (state1: State1, state2: State2, state3: State3) => FinalState,
): NextEnhancer<State, PreExt, Ext<State & FinalState>>;

export function connect<
  State,
  PreExt,
  State1,
  State2,
  State3,
  State4,
  FinalState = State1 & State2 & State3 & State4,
>(
  store1: Store<State1>,
  store2: Store<State2>,
  store3: Store<State3>,
  store4: Store<State4>,
  mapStateToState?: (state1: State1, state2: State2, state3: State3, state4: State4) => FinalState,
): NextEnhancer<State, PreExt, Ext<State & FinalState>>;

export function connect<State, PreExt>(...args: any[]): NextEnhancer<State, PreExt, Ext<State>> {
  const lastParam = args[args.length - 1];

  let combine: (...args: object[]) => object = Object.assign;
  const externalStores: Store<any>[] = args.slice(0, -1);

  if (isFunction(lastParam)) {
    combine = lastParam;
  } else {
    externalStores.push(lastParam);
  }

  return (createStore) => (initialState) => {
    const store = createStore(initialState);
    let isFrozen = false;

    if (process.env.NODE_ENV !== 'production' && typeof store.getState() !== 'object') {
      console.warn('external store state will cover current state which is not object');
    }

    const getAllState = (state?: State) => {
      // 获取外部store的状态
      const externalStates = externalStores.map((store) => store.getState());
      return {
        ...(state || store.getState()),
        ...combine(...externalStates),
      };
    };

    let allState = getAllState();

    // 获取所有store的状态
    const getState = () => allState;

    // 设置当前store的状态，并同步外部store的状态
    const setState: SetState<State> = (update) => {
      if (isFrozen) return;
      const curState = isFunction(update) ? update(allState) : update;
      allState = getAllState(curState);
      store.setState(allState);
    };

    // 外部store的状态更新时，同步到当前store
    const unSubs = externalStores.map((externalStore) =>
      externalStore.subscribe(() => {
        allState = getAllState();
        store.setState(allState);
      }),
    );

    return {
      ...store,
      setState,
      getState,
      freeze: () => {
        isFrozen = true;
        unSubs.forEach((unSub) => unSub());
        store.freeze();
      },
    };
  };
}
