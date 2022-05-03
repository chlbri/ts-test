import { TEST_ERROR } from './constants';
import { dataCompare, mapperTests } from './helpers';
import { Mapper, NFunction, TestFunction, TestProps } from './types';

function log(text: string, arg: any) {
  return console.log(text, '=>', arg);
}

export function mapperTest<F extends NFunction>({
  spy,
  compare,
}: Mapper<F>): TestFunction<F> {
  return async test => {
    const _spy = spy as jest.Mock<Promise<any>, any>;
    const _compare = test.compare ?? compare;
    const _processed = async () => {
      if (spy.length === 0) {
        return await _spy();
      } else if (spy.length === 1) {
        return await _spy(test.args);
      } else {
        return await _spy(...(test.args as any[]));
      }
    };
    let falsePass = false;
    try {
      const processed = await _processed();
      if (test.throws) {
        falsePass = true;
        throw TEST_ERROR;
      }
      const assertion = _compare(processed, test.expected);
      // #region Logs
      log('args', test.args);
      log('expected', test.expected);
      log('processed', processed);
      log('assertion', assertion);
      // #endregion
      expect(assertion).toBe(true);
      return true;
    } catch (error: any) {
      expect(error).toBeDefined();
      if (!test.throws) {
        throw TEST_ERROR;
      }
      if (falsePass) {
        falsePass = false;
        throw TEST_ERROR;
      }
      const thrown = test.thrown;
      // #region Logs
      log('args', test.args);
      log('thrown', error);
      // #endregion
      thrown && expect(error).toStrictEqual(thrown);
      return false;
    }
  };
}

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
