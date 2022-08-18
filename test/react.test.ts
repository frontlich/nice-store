import { renderHook, act } from '@testing-library/react';

import { create } from '../src/react';

describe('create', () => {
  test('works', () => {
    const store = create(0);

    const { result } = renderHook(() => store.useSelector());

    expect(result.current).toBe(0);

    act(() => {
      store.setState(1);
    });

    expect(result.current).toBe(1);

    store.freeze();
    act(() => {
      store.setState(2);
    });

    expect(result.current).toBe(1);
  });
});
