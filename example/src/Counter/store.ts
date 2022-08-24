import create, { async, asyncLoading, reducer, reset, task } from 'nice-store';

export enum ActionType {
  ADD,
  REDUCE,
}

interface Action {
  type: ActionType;
  payload?: number;
}

export const store = create(
  0,
  reducer((state, action: Action) => {
    switch (action.type) {
      case ActionType.ADD:
        return state + (action.payload ?? 1);

      case ActionType.REDUCE:
        return state - (action.payload ?? 1);

      default:
        return state;
    }
  }),
  reset(),
  async(
    (v: number) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(v);
        }, 1000);
      })
  ),
  asyncLoading(),
  task((store) => {
    const timer = setInterval(() => {
      store.dispatch({type: ActionType.ADD});
    }, 1000);

    return () => clearInterval(timer);
  }, false)
);
