import { map, scan } from 'rxjs';

import { createStore } from '../../src/createStore';
import { rx } from '../../src/enhancers/rx';

describe('enhancer:reset', () => {
  test('works', () => {
    const store = createStore(0, rx());

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    store.next(1);
    expect(mockFn).toBeCalled();
    expect(store.getState()).toBe(1);

    store.next(2);
    expect(mockFn).toBeCalledTimes(2);
    expect(store.getState()).toBe(2);
  });

  test('works', async () => {
    const store = createStore(
      0,
      rx(
        map((v: string) => Number(v)),
        scan((acc, v) => acc + v),
      ),
    );

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    store.next('1');
    await Promise.resolve();
    expect(mockFn).toBeCalled();
    expect(store.getState()).toBe(1);

    store.next('2');
    await Promise.resolve();
    expect(mockFn).toBeCalledTimes(2);
    expect(store.getState()).toBe(3);
  });
});
