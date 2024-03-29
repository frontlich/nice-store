import { isFunction } from './utils';

import type { SetState, Listener, UnSubscribe } from './type';

/**
 * 创建一个核心的store
 * @param initialState 初始状态
 * @returns 核心的最小store
 */
export const createCoreStore = <T>(initialState?: T) => {
  const listeners = new Set<Listener<T>>();
  let internalState = initialState as T;
  let isFrozen = false;

  const setState: SetState<T> = (update) => {
    const updateState = isFunction(update) ? update(internalState) : update;

    // 如果状态未变更，不需要执行订阅函数
    if (isFrozen || Object.is(internalState, updateState)) return;

    // 更新内部状态
    internalState = updateState;

    listeners.forEach((listener) => {
      listener(internalState);
    });
  };

  const getState = () => internalState;

  const subscribe = (fn: Listener<T>): UnSubscribe => {
    if (isFrozen) {
      return () => {
        console.error('this store is frozen');
      };
    }

    listeners.add(fn);

    return () => listeners.delete(fn);
  };

  const freeze = () => {
    isFrozen = true;
    listeners.clear();
  };

  return {
    setState,
    getState,
    subscribe,
    freeze,
  };
};
