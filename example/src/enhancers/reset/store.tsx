import create, { reset } from 'nice-store';

export enum ActionType {
  ADD,
  REDUCE,
}

export const store = create(0, reset());
