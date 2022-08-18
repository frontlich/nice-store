import { act, renderHook } from '@testing-library/react';
import { useRequest } from 'ahooks';

import { createStore } from '../../src/createStore';
import { requestCache } from '../../src/enhancers/requestCache';

describe('enhancer:requestCache', () => {
  test('works', async () => {
    const initialState = 0;
    const store = createStore(initialState, requestCache());

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    let i = initialState;
    const { result } = renderHook(() => {
      return useRequest(() => Promise.resolve(i++), store.withCache({ manual: true }));
    });

    await act(() => {
      result.current.run();
      return Promise.resolve();
    });

    expect(mockFn).not.toBeCalled();
    expect(result.current.data).toBe(initialState);
    expect(store.getState()).toBe(result.current.data);

    await act(() => {
      result.current.run();
      return Promise.resolve();
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(result.current.data).toBe(1);
    expect(store.getState()).toBe(result.current.data);
  });

  test('mapData2State', async () => {
    const initialState = 0;
    const store = createStore(initialState, requestCache());

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    let i = initialState;
    const { result } = renderHook(() => {
      return useRequest(
        () => Promise.resolve({ count: i++ }),
        store.withCache((data) => data.count),
      );
    });

    expect(mockFn).not.toBeCalled();
    expect(result.current.data).toBe(initialState);
    expect(store.getState()).toBe(result.current.data);

    await act(() => {
      result.current.run();
      return Promise.resolve();
    });

    expect(mockFn).toBeCalled();
    expect(result.current.data).toEqual({ count: 1 });
    expect(store.getState()).toBe(1);
  });

  test('options & mapData2State', async () => {
    const initialState = 0;
    const store = createStore(initialState, requestCache());

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    let i = initialState;
    const { result } = renderHook(() => {
      return useRequest(
        () => Promise.resolve({ count: i++ }),
        store.withCache({ manual: true }, (data) => data.count),
      );
    });

    await act(() => {
      result.current.run();
      return Promise.resolve();
    });

    expect(mockFn).not.toBeCalled();
    expect(result.current.data).toEqual({ count: 0 });
    expect(store.getState()).toBe(0);

    await act(() => {
      result.current.run();
      return Promise.resolve();
    });

    expect(mockFn).toBeCalled();
    expect(result.current.data).toEqual({ count: 1 });
    expect(store.getState()).toBe(1);
  });
});
