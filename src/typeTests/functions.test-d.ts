/* eslint-disable @typescript-eslint/no-unused-vars */

import { expectType } from 'tsd';
import type {
  CompareFromFunction,
  NFunction,
  TestElement,
  TestWeight,
} from '../types';

type Func1 = (a: number) => any;
type Func2 = (a: number, b?: number) => any;
type Func3 = (a?: number) => any;
type Func4 = (a: number, b: number) => any;
type Func5 = () => any;
type Func6 = (a?: number, b?: number) => any;

declare const var1: TestElement<Func1>;
declare const var2: TestElement<Func2>;
declare const var3: TestElement<Func3>;
declare const var4: TestElement<Func4>;
declare const var5: TestElement<Func5>;
declare const var6: TestElement<Func6>;

// #region Common
type Common<F extends NFunction> = (
  | {
      throws?: false;
      expected?: any;
    }
  | {
      throws: true;
      thrown?: any;
    }
) & {
  invite: string;
  compare?: CompareFromFunction<F>;
  weight?: TestWeight;
  timeout?: number;
};
// #endregion

expectType<
  {
    args: number;
  } & Common<Func1>
>(var1);

expectType<
  {
    args: [number, number?];
  } & Common<Func2>
>(var2);

expectType<
  {
    args?: number | undefined;
  } & Common<Func3>
>(var3);

expectType<
  {
    args: [number, number];
  } & Common<Func4>
>(var4);

expectType<
  {
    args?: undefined;
  } & Common<Func5>
>(var5);

expectType<
  {
    args?: [number?, number?];
  } & Common<Func6>
>(var6);
