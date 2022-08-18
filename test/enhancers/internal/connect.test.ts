import { createStore } from '../../../src/createStore';
import { connect } from '../../../src/enhancers/internal/connect';

describe('enhancer:connect', () => {
  test("store state isn't object will show warn", () => {
    const warnFn = jest.fn();
    jest.spyOn(console, 'warn').mockImplementation(warnFn);
    const store1 = createStore(0);
    const store = createStore(1, connect(store1));

    expect(store.getState()).toEqual({});
    expect(warnFn).toBeCalled();
  });

  test('works with combine', () => {
    const store1 = createStore(0);
    const store2 = createStore({ a: 1 });
    const store3 = createStore({ b: 2 });
    const store = createStore(
      { d: 3 },
      connect(store1, store2, store3, (s1, s2, s3) => ({
        e: s1,
        f: s2.a,
        g: s3.b,
      })),
    );

    expect(store.getState()).toEqual({ d: 3, e: 0, f: 1, g: 2 });

    const mockFn = jest.fn(),
      mockFn2 = jest.fn();
    store.subscribe(mockFn);
    store1.subscribe(mockFn2);

    store.setState({ d: 4 });
    expect(mockFn).toBeCalledWith({ d: 4, e: 0, f: 1, g: 2 });
    expect(mockFn2).not.toBeCalled();
    expect(store.getState()).toEqual({ d: 4, e: 0, f: 1, g: 2 });

    store1.setState(5);
    expect(mockFn).toBeCalledWith({ d: 4, e: 5, f: 1, g: 2 });
    expect(mockFn).toBeCalledTimes(2);
    expect(mockFn2).toBeCalledTimes(1);
    expect(store1.getState()).toBe(5);
    expect(store.getState()).toEqual({ d: 4, e: 5, f: 1, g: 2 });

    store.freeze();
    store1.setState(6);
    expect(mockFn).toBeCalledTimes(2);
    expect(mockFn2).toBeCalledTimes(2);
    expect(store1.getState()).toBe(6);
    expect(store.getState()).toEqual({ d: 4, e: 5, f: 1, g: 2 });
  });
});
