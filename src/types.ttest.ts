/* eslint-disable @typescript-eslint/no-unused-vars */

import type { LengthOf } from '@bemedev/types';
import type { TestElement } from './types';

function func1(a: number) {
  return a;
}
function func2(a: number, b?: number) {
  return a;
}
function func3(a?: number) {
  return a;
}
function func4(a: number, b: number) {
  return a;
}
function func5() {
  return 4;
}
function func6(a?: number, b?: number) {
  return 4;
}

type Test1 = TestElement<typeof func1>;
type Test2 = TestElement<typeof func2>;
type Test3 = TestElement<typeof func3>;

type Test4 = TestElement<typeof func4>;
type Test5 = TestElement<typeof func5>;
type Test6 = TestElement<typeof func6>;
type Test6b = LengthOf<Test6['args']>;
