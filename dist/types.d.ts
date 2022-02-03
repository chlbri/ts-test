/// <reference types="jest" />
import type { DeepPartial, LengthOf, Primitive, ThenArg } from '@core_chlbri/core';
export declare type NFunction<R = any, P extends any[] = any[]> = (...args: P) => R;
export declare type AsyncFunction<R = Promise<any>, P extends any[] = any[]> = NFunction<R, P>;
export declare type TestElement<F extends NFunction> = (LengthOf<Parameters<F>> extends 0 ? {
    args?: never;
} : LengthOf<Parameters<F>> extends 1 ? {
    args: Parameters<F>[0];
} : 0 extends LengthOf<Parameters<F>> ? {
    args?: LengthOf<Parameters<F>> extends 0 | 1 ? Parameters<F>[0] : Parameters<F>;
} : {
    args: Parameters<F>;
}) & {
    invite?: string;
} & ({
    throws?: false;
    expected?: ExpectedFromFunction<F>;
} | {
    throws: true;
    thrown?: any;
});
export declare type Compare<T = any> = NFunction<boolean, [
    arg1: T,
    arg2?: Expected<T>
]>;
export declare type CompareFromFunction<F extends NFunction = NFunction> = Compare<ThenArg<ReturnType<F>>>;
export declare type DeepExpected<T> = DeepPartial<T extends {
    [key: string]: infer U;
} ? U extends Primitive ? U : DeepExpected<U> : Record<string, never>>;
export declare type ThenArgFromFunction<F extends NFunction = NFunction> = ThenArg<ReturnType<F>>;
export declare type Expected<T> = DeepPartial<T> | DeepExpected<T>;
export declare type ExpectedFromFunction<F extends NFunction = NFunction> = DeepPartial<ThenArgFromFunction<F>> | DeepExpected<ThenArgFromFunction<F>>;
export declare type TE<F extends NFunction> = TestElement<F>;
export declare type TestFunction<F extends NFunction> = (arg: TestElement<F>) => Promise<void>;
export declare type JestMockFromFunction<F extends NFunction = NFunction> = jest.Mock<ThenArgFromFunction<F>, Parameters<F>>;
export declare type Mapper<F extends NFunction> = {
    spy: JestMockFromFunction<F>;
    uuid?: boolean;
    compare: CompareFromFunction<F>;
};
export declare type TestProps<F extends NFunction = NFunction> = {
    func: F;
    tests: TestElement<F>[];
    compare?: CompareFromFunction<F>;
};
export declare type TestTable<F extends NFunction> = TestElement<F>[];
