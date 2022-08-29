import { createStore } from '../../src/createStore';
import { immer } from '../../src/enhancers/immer';

describe('enhancer:immer', () => {
  test('works', () => {
    const store = createStore({ count: 0, ext: 0 }, immer());

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    store.produce((s) => void (s.count = 1));
    expect(mockFn).toBeCalled();
    expect(store.getState()).toEqual({ count: 1, ext: 0 });

    store.produce((s) => void (s.count += 1));
    expect(mockFn).toBeCalledTimes(2);
    expect(store.getState()).toEqual({ count: 2, ext: 0 });

    store.produce((s) => void (s.ext = 1));
    expect(mockFn).toBeCalledTimes(3);
    expect(store.getState()).toEqual({ count: 2, ext: 1 });
  });
});
