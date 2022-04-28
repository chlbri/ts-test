import { Compare, UND } from '../types';

function isArray<T>(value: unknown): value is Array<T> {
  return value instanceof Array;
}

function isNullish(val: unknown): val is undefined | null {
  return val === null || val === undefined;
}

function _shallowCompareArray(arg1?: any[], arg2?: any[]) {
  if (isNullish(arg2) || isNullish(arg1)) {
    return true;
  }
  if (arg2.length > arg1.length) return false;
  let out = true;
  for (let index = 0; index < arg2.length; index++) {
    const el1 = arg1[index];
    const el2 = arg2[index];
    out = _shallowCompare(el1, el2);
    if (!out) {
      break;
    }
  }
  return out;
}

function _reduce(arg: object, ...keys: string[]) {
  return Object.entries({ ...arg })
    .filter(([key]) => {
      const len = keys.length;
      const check = len > 0;
      return check ? keys.includes(key) : true;
    })
    .filter(([, value]) => !isNullish(value))
    .reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {} as any);
}

function isObject(...args: any[]): boolean {
  return args.every(arg => typeof arg === 'object');
}

function _shallowCompare(arg1: any, arg2: any): boolean {
  if (isNullish(arg2)) return true;

  if (arg2 === UND) {
    return arg1 === undefined;
  }

  if (!isObject(arg1, arg2)) {
    return arg1 === arg2;
  }
  if (isArray(arg1) || isArray(arg2)) {
    return _shallowCompareArray(arg1, arg2);
  }

  const _arg2 = _reduce(arg2);

  const keys2 = Object.keys(_arg2);

  if (!keys2.length) {
    return true;
  }

  const _arg1 = _reduce(arg1, ...keys2);

  for (const key in _arg2) {
    if (Object.prototype.hasOwnProperty.call(_arg2, key)) {
      const el1 = _arg1[key];
      const el2 = _arg2[key];
      const check =
        (isArray(el2) && isArray(el1)) ||
        isObject(el1, el2) ||
        el2 === UND;

      if (check) {
        if (!_shallowCompare(el1, el2)) {
          return false;
        }
      } else {
        return el1 === el2;
      }
    }
  }
  return true;
}

export function shallowCompare<T = any>(
  ...[arg1, arg2]: Parameters<Compare<T>>
): ReturnType<Compare<T>> {
  return _shallowCompare(arg1, arg2);
}

export function dataCompare<T = any>(
  ...[arg1, arg2]: Parameters<Compare<T>>
): ReturnType<Compare<T>> {
  return JSON.stringify(arg1) === JSON.stringify(arg2);
}

export function identityCompare<T = any>(arg1: T, arg2: T): boolean {
  return arg1 === arg2;
}
