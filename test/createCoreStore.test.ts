import { createCoreStore } from '../src/createCoreStore';

describe('createCoreStore', () => {
  test('works', () => {
    const fn1 = jest.fn(),
      fn2 = jest.fn();
    const store = createCoreStore();

    const fn1UnSub = store.subscribe(fn1);
    expect(fn1).not.toBeCalled();
    expect(store.getState()).toBeUndefined();

    store.setState(1);
    expect(fn1).toBeCalledTimes(1);
    expect(store.getState()).toBe(1);

    store.setState(1);
    expect(fn1).toBeCalledTimes(1);
    expect(store.getState()).toBe(1);

    store.subscribe(fn2);
    expect(fn2).not.toBeCalled();

    store.setState(2);
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(1);
    expect(store.getState()).toBe(2);

    fn1UnSub();
    store.setState(3);
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
    expect(store.getState()).toBe(3);

    store.freeze();
    const fn3 = jest.fn();
    const fn3UnSub = store.subscribe(fn3);
    store.setState(4);
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
    expect(fn3).not.toBeCalled();
    expect(store.getState()).toBe(3);

    const logErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fn3UnSub();
    expect(logErrorSpy).toBeCalled();
  });
});
