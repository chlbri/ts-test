/// <reference types="jest" />
import { ThenArg } from '@core_chlbri/core';
import type { Mapper, NFunction, TestFunction, TestProps } from './types';
export declare function mapperTest<F extends NFunction>({ spy, compare, }: Mapper<F>): TestFunction<F>;
export declare const ttest: {
    <F extends NFunction<any, any[]> = NFunction<any, any[]>>({ func, tests, compare, }: TestProps<F>): jest.Mock<ThenArg<ReturnType<F>>, Parameters<F>>;
    skip<F_1 extends NFunction<any, any[]> = NFunction<any, any[]>>({ func }: TestProps<F_1>): jest.Mock<ThenArg<ReturnType<F_1>>, Parameters<F_1>>;
    concurrent<F_2 extends NFunction<any, any[]> = NFunction<any, any[]>>({ func, tests, compare, }: TestProps<F_2>): jest.Mock<ThenArg<ReturnType<F_2>>, Parameters<F_2>>;
    only<F_3 extends NFunction<any, any[]> = NFunction<any, any[]>>({ func, tests, compare, }: TestProps<F_3>): jest.Mock<ThenArg<ReturnType<F_3>>, Parameters<F_3>>;
};
