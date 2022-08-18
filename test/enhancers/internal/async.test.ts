import { createStore } from '../../../src/createStore';
import { async } from '../../../src/enhancers/internal/async';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('enhancer:async', () => {
  test('setState after micro task', async () => {
    const store = createStore(
      1,
      async((v: number) => Promise.resolve(v)),
    );

    const res = store.runAsync(2);
    expect(store.getState()).toBe(1);
    expect(res).resolves.toBe(2);

    await Promise.resolve();
    expect(store.getState()).toBe(2);
  });

  test('setState after macro task', async () => {
    const store = createStore(
      1,
      async(
        (v: number) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(v);
            }, 1000);
          }),
      ),
    );

    const res = store.runAsync(2);
    expect(store.getState()).toBe(1);
    expect(res).resolves.toBe(2);

    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(store.getState()).toBe(2);
  });

  test('takeLatest', async () => {
    const overdueError = new Error('test');
    const store = createStore(
      1,
      async(
        (v: number) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(v);
            }, 1000);
          }),
        'takeLatest',
        overdueError,
      ),
    );

    const res1 = store.runAsync(2);
    expect(store.getState()).toBe(1);
    expect(res1).rejects.toBe(overdueError);

    jest.advanceTimersByTime(500);
    const res2 = store.runAsync(3);
    expect(store.getState()).toBe(1);
    expect(res2).resolves.toBe(3);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(store.getState()).toBe(1);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(store.getState()).toBe(3);
  });

  test('takeEvery', async () => {
    const store = createStore(
      1,
      async(
        (v: number) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(v);
            }, 1000);
          }),
        'takeEvery',
      ),
    );

    const res1 = store.runAsync(2);
    expect(store.getState()).toBe(1);
    expect(res1).resolves.toBe(2);

    jest.advanceTimersByTime(500);
    const res2 = store.runAsync(3);
    expect(store.getState()).toBe(1);
    expect(res2).resolves.toBe(3);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(store.getState()).toBe(2);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(store.getState()).toBe(3);
  });
});
