import { Subject } from 'rxjs';
import type { OperatorFunction } from 'rxjs';

import { checkStore } from '../utils';
import type { NextEnhancer } from '../type';

type Ext<T> = {
  next: (v: T) => void;
};

export function rx<State, PreExt>(): NextEnhancer<State, PreExt, Ext<State>>;

export function rx<State, PreExt, T>(
  operator: OperatorFunction<T, State>,
): NextEnhancer<State, PreExt, Ext<T>>;

export function rx<State, PreExt, T1, T2>(
  operator1: OperatorFunction<T1, T2>,
  operator2: OperatorFunction<T2, State>,
): NextEnhancer<State, PreExt, Ext<T1>>;

export function rx<State, PreExt, T1, T2, T3>(
  operator1: OperatorFunction<T1, T2>,
  operator2: OperatorFunction<T2, T3>,
  operator3: OperatorFunction<T3, State>,
): NextEnhancer<State, PreExt, Ext<T1>>;

export function rx<State, PreExt, T1, T2, T3, T4>(
  operator1: OperatorFunction<T1, T2>,
  operator2: OperatorFunction<T2, T3>,
  operator3: OperatorFunction<T3, T4>,
  operator4: OperatorFunction<T4, State>,
): NextEnhancer<State, PreExt, Ext<T1>>;

export function rx<State, PreExt, T1, T2, T3, T4, T5>(
  operator1: OperatorFunction<T1, T2>,
  operator2: OperatorFunction<T2, T3>,
  operator3: OperatorFunction<T3, T4>,
  operator4: OperatorFunction<T4, T5>,
  operator5: OperatorFunction<T5, State>,
): NextEnhancer<State, PreExt, Ext<T1>>;

export function rx<State, PreExt, Next>(
  ...operators: any[]
): NextEnhancer<State, PreExt, Ext<Next>> {
  return (createStore) => (initialState) => {
    const store = createStore(initialState);

    if (process.env.NODE_ENV !== 'production') {
      checkStore(store, 'rx', 'next');
    }

    const subject = new Subject<Next>();

    const sub = subject
      .pipe(...(operators as [OperatorFunction<Next, State>]))
      .subscribe(store.setState.bind(store));

    return {
      ...store,
      next: subject.next.bind(subject),
      freeze: () => {
        sub.unsubscribe();
        store.freeze();
      },
    };
  };
}
