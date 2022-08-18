import { checkStore, isFunction } from '../../utils';
import type { EnhancedStore, NextEnhancer } from '../../type';

type OmitFirstParameter<T extends (first: any, ...arg: any[]) => any> =
  T extends (first: any, ...rest: infer P) => infer R
    ? (...arg: P) => R
    : never;

type Cancel = void | ((...args: any[]) => any);

type TaskFn<S, E, C extends Cancel> = (
  store: EnhancedStore<S, E>,
  ...arg: any[]
) => C;

type CancelTask<T extends TaskFn<any, any, any>> = ReturnType<T> extends (
  ...args: any[]
) => any
  ? ReturnType<T>
  : () => void;

type Ext<Fn extends TaskFn<any, any, any>> = {
  runTask: OmitFirstParameter<Fn>;
  cancelTask: CancelTask<Fn>;
};

export const task =
  <State, PreExt, Task extends TaskFn<State, PreExt, Cancel>>(
    taskFn: Task,
    autoRun = true
  ): NextEnhancer<State, PreExt, Ext<Task>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'task', 'runTask', 'cancelTask');
    }

    let cancel: Cancel;

    const cancelTask = ((...args: any[]) => {
      return isFunction(cancel) && cancel(...args);
    }) as CancelTask<Task>;

    const runTask = ((...args) => {
      cancelTask();
      return (cancel = taskFn(store, ...args));
    }) as OmitFirstParameter<Task>;

    if (autoRun) {
      cancel = runTask();
    }

    return {
      ...store,
      runTask,
      cancelTask,
      freeze: () => {
        cancelTask();
        store.freeze();
      },
    };
  };
