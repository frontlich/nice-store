import { createStore } from '../../../src/createStore';
import { reducer } from '../../../src/enhancers/internal/reducer';

describe('enhancer:reducer', () => {
  test('works', () => {
    const store = createStore(
      0,
      reducer((state, action: 'ADD' | 'REDUCE') => {
        switch (action) {
          case 'ADD':
            return state + 1;
          case 'REDUCE':
            return state - 1;
          default:
            return state;
        }
      })
    );

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    const action = store.dispatch('ADD');
    expect(mockFn).toBeCalled();
    expect(store.getState()).toBe(1);
    expect(action).toBe('ADD');

    store.dispatch('ADD');
    expect(mockFn).toBeCalledTimes(2);
    expect(store.getState()).toBe(2);

    store.dispatch('REDUCE');
    expect(mockFn).toBeCalledTimes(3);
    expect(store.getState()).toBe(1);

    store.dispatch('never' as 'ADD');
    expect(mockFn).toBeCalledTimes(3);
    expect(store.getState()).toBe(1);
  });
});
