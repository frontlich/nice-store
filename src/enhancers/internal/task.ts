import { checkStore, isFunction } from '../../utils';
import type { EnhancedStore, NextEnhancer } from '../../type';

type Ext<Cancel> = {
  runTask: () => Cancel;
  cancelTask: () => void;
};

export const task =
  <State, PreExt, Cancel>(
    taskFn: (store: EnhancedStore<State, PreExt>) => Cancel,
    autoRun = true
  ): NextEnhancer<State, PreExt, Ext<Cancel>> =>
  (createStore) =>
  (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'task', 'runTask', 'cancelTask');
    }

    const runTask = () => taskFn(store);

    let cancel: Cancel;

    if (autoRun) {
      cancel = runTask();
    }

    const cancelTask = () => {
      isFunction(cancel) && cancel();
    };

    return {
      ...store,
      runTask,
      cancelTask,
      destroy: () => {
        cancelTask();
        store.destroy();
      },
    };
  };
