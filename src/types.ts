import type { DeepPartial, LengthOf, Primitive, ThenArg } from 'core';

export type NFunction<R = any, P extends any[] = any[]> = (
  ...args: P
) => R;

export type AsyncFunction<
  R = Promise<any>,
  P extends any[] = any[],
> = NFunction<R, P>;

export type TestElement<F extends NFunction> = (LengthOf<
  Parameters<F>
> extends 0
  ? {
      args?: never;
    }
  : LengthOf<Parameters<F>> extends 1
  ? {
      args: Parameters<F>[0];
    }
  : 0 extends LengthOf<Parameters<F>>
  ? {
      args?: LengthOf<Parameters<F>> extends 0 | 1
        ? Parameters<F>[0]
        : Parameters<F>;
    }
  : {
      args: Parameters<F>;
    }) & { invite?: string } & (
    | {
        throws?: false;
        expected?: ExpectedFromFunction<F>;
      }
    | { throws: true; thrown?: any }
  );

export type Compare<T = any> = NFunction<
  boolean,
  [arg1: T, arg2?: Expected<T>]
>;

export type CompareFromFunction<F extends NFunction = NFunction> = Compare<
  ThenArg<ReturnType<F>>
>;

export type DeepExpected<T> = DeepPartial<
  T extends {
    [key: string]: infer U;
  }
    ? U extends Primitive
      ? U
      : DeepExpected<U>
    : Record<string, never>
>;

export type ThenArgFromFunction<F extends NFunction = NFunction> = ThenArg<
  ReturnType<F>
>;

export type Expected<T> = DeepPartial<T> | DeepExpected<T>;

export type ExpectedFromFunction<F extends NFunction = NFunction> =
  | DeepPartial<ThenArgFromFunction<F>>
  | DeepExpected<ThenArgFromFunction<F>>;

export type TE<F extends NFunction> = TestElement<F>;

export type TestFunction<F extends NFunction> = (
  arg: TestElement<F>,
) => Promise<void>;

export type JestMockFromFunction<F extends NFunction = NFunction> =
  jest.Mock<ThenArgFromFunction<F>, Parameters<F>>;

export type Mapper<F extends NFunction> = {
  spy: JestMockFromFunction<F>;
  uuid?: boolean;
  compare: CompareFromFunction<F>;
};

export type TestProps<F extends NFunction = NFunction> = {
  func: F;
  tests: TestElement<F>[];
  compare?: CompareFromFunction<F>;
};

export type TestTable<F extends NFunction> = TestElement<F>[];
