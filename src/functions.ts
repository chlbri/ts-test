import { dataCompare, mapperTests } from './helpers';
import { NFunction, TestProps } from './types';

export const ttest = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
  timeout,
}: TestProps<F>) => {
  return mapperTests<F>(func, compare, tests, it, timeout);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ttest.skip = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
  timeout,
}: TestProps<F>) => {
  return mapperTests<F>(func, compare, tests, it.skip, timeout);
};

ttest.todo = (todo: string) => {
  return it.todo(todo);
};

ttest.concurrent = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
  timeout,
}: TestProps<F>) => {
  return mapperTests<F>(func, compare, tests, it.concurrent, timeout);
};

ttest.only = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
  timeout,
}: TestProps<F>) => {
  return mapperTests<F>(func, compare, tests, it.only, timeout);
};
