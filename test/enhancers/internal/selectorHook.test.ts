import { renderHook, act } from '@testing-library/react';

import { createStore } from '../../../src/createStore';
import { selectorHook } from '../../../src/enhancers/internal/selectorHook';

describe('enhancer:selectorHook', () => {
  test('works', () => {
    const initialState = 0;
    const store = createStore(initialState, selectorHook());

    const { result } = renderHook(() => store.useSelector());

    expect(result.current).toBe(initialState);

    act(() => {
      store.setState(1);
    });

    expect(result.current).toBe(1);
  });

  test('with selector', () => {
    const initialState = { a: 0 };
    const store = createStore(initialState, selectorHook());

    const { result } = renderHook(() => store.useSelector((state) => state.a));

    expect(result.current).toBe(0);

    act(() => {
      store.setState({ a: 1 });
    });

    expect(result.current).toBe(1);
  });

  test('with compare', () => {
    const initialState = { a: 0, b: 0 };
    const store = createStore(initialState, selectorHook());

    const { result } = renderHook(() => {
      return store.useSelector(
        (state) => ({ c: { d: state.a + state.b } }),
        (pre, cur) => cur.c.d === pre.c.d,
      );
    });

    const curResult = result.current;
    expect(result.current).toEqual({ c: { d: 0 } });

    act(() => {
      store.setState({ a: -1, b: 1 });
    });
    expect(result.current).toBe(curResult);

    act(() => {
      store.setState({ a: 0, b: 1 });
    });
    expect(result.current).toEqual({ c: { d: 1 } });
  });
});
