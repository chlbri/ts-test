import { JestTest } from './types';
import { dataCompare } from './helpers/compares';
import { mapperJest } from './helpers/mappers';
import {
  JestFunction,
  Mapper,
  NFunction,
  TestFunction,
  TestProps,
  TEST_ERROR,
} from './types';

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
}: TestProps<F>) => {
  const spy = jest.fn(func) as JestFunction<F>;
  const mapper = mapperTest({ spy, compare });
  tests.map((test, iterator) => {
    const weight = test.weight ?? 1;
    const _test: JestTest = {
      ...test,
      iterator,
      weight,
    };
    const invite = mapperJest(_test);
    // const id = nanoid();
    let assertion = true;
    it(invite, async () => {
      assertion = await mapper(test);
    });
    return { assertion, weight };
  });
  return spy;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ttest.skip = <F extends NFunction = NFunction>({ func }: TestProps<F>) => {
  const spy = jest.fn(func) as JestFunction<F>;
  return spy;
};

ttest.todo = <F extends NFunction = NFunction>(
  todo: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _?: TestProps<F>,
) => {
  return todo;
};

ttest.concurrent = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
}: TestProps<F>) => {
  const spy = jest.fn(func) as JestFunction<F>;
  const mapper = mapperTest({ spy, compare });
  tests.forEach((test, iterator) => {
    const weight = test.weight ?? 1;
    const _test: JestTest = {
      ...test,
      iterator,
      weight,
    };
    const invite = mapperJest(_test);
    let assertion = true;
    it.concurrent(invite, async () => {
      assertion = await mapper(test);
    });
    return { assertion, weight };
  });
  return spy;
};

ttest.only = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
}: TestProps<F>) => {
  const spy = jest.fn(func) as JestFunction<F>;
  const mapper = mapperTest({ spy, compare });
  tests.forEach((test, iterator) => {
    const weight = test.weight ?? 1;
    const _test: JestTest = {
      ...test,
      iterator,
      weight,
    };
    const invite = mapperJest(_test);
    let assertion = true;
    it.only(invite, async () => {
      assertion = await mapper(test);
    });
    return { assertion, weight };
  });
  return spy;
};
