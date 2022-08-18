import { act, renderHook } from '@testing-library/react';

import { createStore } from '../../../src/createStore';
import { async } from '../../../src/enhancers/internal/async';
import { asyncLoading } from '../../../src/enhancers/internal/asyncLoading';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

describe('enhancer:asyncLoading', () => {
  test('takeLatest - 1', async () => {
    const store = createStore(
      1,
      async(
        (v: number) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(v);
            }, v * 1000);
          }),
      ),
      asyncLoading(),
    );

    const { result } = renderHook(() => store.useLoading());
    expect(result.current).toBe(false);

    act(() => {
      store.runAsync(2);
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(2000); // 2秒后
      return Promise.resolve();
    });
    expect(result.current).toBe(false);

    await act(() => {
      store.runAsync(2);
      return Promise.resolve();
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(1000);
      return Promise.resolve();
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(1000);
      return Promise.resolve();
    });
    expect(result.current).toBe(false);
  });

  test('takeLatest - 2', async () => {
    const store = createStore(
      1,
      async(
        (v: number) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(v);
            }, v * 1000);
          }),
      ),
      asyncLoading(),
    );

    const { result } = renderHook(() => store.useLoading());
    expect(result.current).toBe(false);

    act(() => {
      const res = store.runAsync(5); // 第一次延时5秒
      expect(res).rejects.toBeDefined();
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(1000); // 1秒后
      store.runAsync(2); // 第二次延时2秒
      return Promise.resolve();
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(1000); // 又1秒后
      return Promise.resolve();
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(1000);
      return Promise.resolve();
    });
    expect(result.current).toBe(false);
  });

  test('takeEvery', async () => {
    const store = createStore(
      1,
      async(
        (v: number) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(v);
            }, v * 1000);
          }),
        'takeEvery',
      ),
      asyncLoading(),
    );

    const { result } = renderHook(() => store.useLoading('takeEvery'));
    expect(result.current).toBe(false);

    act(() => {
      store.runAsync(5);
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(1000);
      store.runAsync(1);
      return Promise.resolve();
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(1000);
      return Promise.resolve();
    });
    expect(result.current).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(3000);
      return Promise.resolve();
    });
    expect(result.current).toBe(false);
  });
});
