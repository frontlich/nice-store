import { createStore } from '../../../src/createStore';
import { thunk } from '../../../src/enhancers/internal/thunk';

beforeAll(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('enhancer:thunk', () => {
  test('works', () => {
    const initialState = 0;
    const store = createStore(initialState, thunk());

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    store.dispatch((store) => {
      setTimeout(() => {
        store.setState(1);
      }, 1000);
    });
    expect(mockFn).not.toBeCalled();
    expect(store.getState()).toBe(initialState);

    jest.advanceTimersByTime(1000);

    expect(mockFn).toBeCalled();
    expect(store.getState()).toBe(1);

    expect(() => store.dispatch('action' as any)).toThrowError();
  });
});
