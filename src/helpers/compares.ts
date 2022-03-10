import { dequal } from 'dequal';
import type { Compare } from '../types';

function isArray<T>(value: unknown): value is Array<T> {
  return value instanceof Array;
}

function isNullish(val: unknown): val is undefined | null {
  return val === null || val === undefined;
}

function _compareArray(arg1?: any[], arg2?: any[]) {
  if (isNullish(arg2) || isNullish(arg1)) {
    return true;
  }
  if (arg2.length > arg1.length) return false;
  let out = true;
  for (let index = 0; index < arg2.length; index++) {
    const el1 = arg1[index];
    const el2 = arg2[index];
    out = _dataCompare(el1, el2);
    if (!out) {
      break;
    }
  }
  return out;
}

function _dataCompare(arg1: any, arg2: any): boolean {
  if (isNullish(arg2)) return true;
  if (typeof arg1 !== 'object' || typeof arg2 !== 'object') {
    return arg1 === arg2;
  }
  if (isArray(arg1) || isArray(arg2)) {
    return _compareArray(arg1, arg2);
  }

  const _arg2 = Object.entries({ ...arg2 })
    .filter(([, value]) => !isNullish(value))
    .reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {} as any);

  const keys2 = Object.keys(_arg2);

  if (!keys2.length) {
    return true;
  }

  const _arg1 = Object.entries({ ...arg1 })
    .filter(([key]) => {
      return keys2.includes(key);
    })
    .reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {} as any);

  return dequal(_arg1, _arg2);
}

export function dataCompare<T = any>(
  ...[arg1, arg2]: Parameters<Compare<T>>
): ReturnType<Compare<T>> {
  return _dataCompare(arg1, arg2);
}

export function identityCompare(arg1: any, arg2: any): boolean {
  return arg1 === arg2;
}
