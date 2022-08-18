import { createStore } from '../src/createStore';

describe('createStore', () => {
  test('works', () => {
    const initialState = {};
    const fn = jest.fn();
    const fn2 = jest.fn();
    const custom = jest.fn(() => {
      fn();
      fn();
    });

    const store = createStore(
      initialState,
      (c) => (i) => {
        fn2(i);
        return {
          ...c(i),
          custom,
        };
      },
      (c) => (i) => c(i)
    );

    expect(fn2).toBeCalledWith(initialState);
    expect(fn2).toBeCalledTimes(1);
    expect(store.custom).toBeTruthy();

    store.custom();

    expect(store.custom).toBeCalledTimes(1);
    expect(fn).toBeCalledTimes(2);
  });
});
