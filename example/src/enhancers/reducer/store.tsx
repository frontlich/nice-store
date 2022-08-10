import create, { reducer } from 'nice-store';

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
  })
);
