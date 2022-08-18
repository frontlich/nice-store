import { create } from '../src/react';
import { isFunction, defaultSelector, shallowEqual, pipeFromArray, checkStore } from '../src/utils';

describe('utils', () => {
  test('isFunction', () => {
    expect(isFunction(0)).toBe(false);
    expect(isFunction({})).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(Function.prototype)).toBe(true);
    expect(isFunction(new Function())).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(Date)).toBe(true);
  });

  test('defaultSelector', () => {
    expect(defaultSelector(0)).toBe(0);
    expect(defaultSelector('1')).toBe('1');
    const obj = {};
    expect(defaultSelector(obj)).toBe(obj);
  });
  test('shallowEqual', () => {
    expect(shallowEqual(0, 0)).toBe(true);
    expect(shallowEqual(-0, +0)).toBe(false);
    expect(shallowEqual(NaN, NaN)).toBe(true);
    expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(shallowEqual({ a: { b: 2 } }, { a: { b: 2 } })).toBe(false);
  });
  test('pipeFromArray', () => {
    expect(
      pipeFromArray([(v: number) => v + 1, (v: number) => v + 2, (v: number) => String(v)])(0),
    ).toBe('3');
  });
  test('checkStore', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {
      throw new Error();
    });
    expect(() => checkStore(create(), 'myEnhancer', 'custom')).not.toThrowError();

    expect(() => checkStore(create(), 'myEnhancer', 'useSelector')).toThrowError();
  });
});
