import type { Store } from './type';

export const isFunction = (obj: unknown): obj is Function =>
  typeof obj === 'function';

export const defaultSelector = (arg: any) => arg;

export const shallowEqual = <T, U>(objA: T, objB: U) => {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i] as string) ||
      !Object.is(objA[keysA[i] as keyof T], objB[keysA[i] as keyof U])
    ) {
      return false;
    }
  }
  return true;
};

export const pipeFromArray = (fns: Function[]) => {
  return (input: any) => fns.reduce((pre, fn) => fn(pre), input);
};

export const checkStore = <S>(
  store: Store<S>,
  enhancerName: string,
  ...properties: string[]
) => {
  if (process.env.NODE_ENV !== 'production') {
    const dangerProperties = properties.filter((property) =>
      Object.prototype.hasOwnProperty.call(store, property)
    );

    if (dangerProperties.length) {
      const isMulti = dangerProperties.length > 1;
      console.warn(
        `the enhancer \`${enhancerName}\` will add ${
          isMulti ? 'properties' : 'property'
        } \`${dangerProperties.join(',')}\` to store which already has ${
          isMulti ? 'those' : 'this'
        } property`
      );
    }
  }
};
