export const isFunction = (obj: unknown): obj is Function =>
  typeof obj === "function";

export const defaultSelector = (arg: any) => arg;

export const shallowEqual = <T, U>(objA: T, objB: U) => {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
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
