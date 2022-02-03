import type { Compare } from '../types';
export declare function dataCompare<T = any>(...[arg1, arg2]: Parameters<Compare<T>>): ReturnType<Compare<T>>;
export declare function identityCompare(arg1: any, arg2: any): boolean;
