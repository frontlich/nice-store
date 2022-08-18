import { createStore } from '../../../src/createStore';
import { task } from '../../../src/enhancers/internal/task';

describe('enhancer:task', () => {
  test('auto run', () => {
    jest.useFakeTimers();
    const mockRunFn = jest.fn();
    const mockCancelFn = jest.fn();
    const store = createStore(
      0,
      task(() => {
        mockRunFn();
        return () => {
          mockCancelFn();
        };
      })
    );

    expect(mockRunFn).toBeCalled();

    store.cancelTask();
    expect(mockCancelFn).toBeCalled();

    const cancel = store.runTask();
    expect(mockRunFn).toBeCalledTimes(2);
    expect(mockCancelFn).toBeCalledTimes(2);

    cancel();
    expect(mockRunFn).toBeCalledTimes(2);
    expect(mockCancelFn).toBeCalledTimes(3);
  });

  test('manual run', () => {
    const mockRunFn = jest.fn();
    const mockCancelFn = jest.fn();
    const store = createStore(
      0,
      task(() => {
        mockRunFn();
        return () => {
          mockCancelFn();
        };
      }, false)
    );

    expect(mockRunFn).not.toBeCalled();

    const cancel = store.runTask();
    expect(mockRunFn).toBeCalled();
    expect(mockCancelFn).not.toBeCalled();

    cancel();
    expect(mockRunFn).toBeCalledTimes(1);
    expect(mockCancelFn).toBeCalledTimes(1);

    store.cancelTask();
    expect(mockRunFn).toBeCalledTimes(1);
    expect(mockCancelFn).toBeCalledTimes(2);
  });

  test('interval task', () => {
    jest.useFakeTimers();
    const store = createStore(
      0,
      task((store) => {
        const timer = setInterval(() => {
          store.setState((c) => c + 1);
        }, 1000);
        return () => clearInterval(timer);
      })
    );

    const mockFn = jest.fn();
    store.subscribe(mockFn);

    jest.advanceTimersByTime(1000);
    expect(mockFn).toBeCalledWith(1);

    jest.advanceTimersByTime(1000);
    expect(mockFn).toBeCalledWith(2);
    expect(mockFn).toBeCalledTimes(2);

    jest.advanceTimersByTime(1000);
    expect(mockFn).toBeCalledWith(3);
    expect(mockFn).toBeCalledTimes(3);

    store.cancelTask();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toBeCalledTimes(3);

    jest.clearAllTimers();
    jest.useRealTimers();
  });
});
