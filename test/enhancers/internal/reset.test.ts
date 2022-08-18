import { createStore } from '../../../src/createStore';
import { reset } from '../../../src/enhancers/internal/reset';

describe('enhancer:reset', () => {
  test('works', () => {
    const initialState = 0;
    const store = createStore(initialState, reset());

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    store.setState(1);
    expect(mockFn).toBeCalled();
    expect(store.getState()).toBe(1);

    store.resetState();
    expect(mockFn).toBeCalledTimes(2);
    expect(store.getState()).toBe(initialState);
  });
});
