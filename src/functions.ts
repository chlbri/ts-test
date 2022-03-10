import { ThenArg } from '@bemedev/types';
import { nanoid } from 'nanoid';
import { dataCompare } from './helpers/compares';
import type { Mapper, NFunction, TestFunction, TestProps } from './types';

function log(text: string, arg: any) {
  return console.log(text, '=>', arg);
}

export function mapperTest<F extends NFunction>({
  spy,
  compare,
}: Mapper<F>): TestFunction<F> {
  return async test => {
    const _spy = spy as jest.Mock<Promise<any>>;
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
        return expect(false).toBe(true);
      }
      const assertion = compare(processed, test.expected);
      // #region Logs
      log('args', test.args);
      log('expected', test.expected);
      log('_processed', _processed);
      log('assertion', assertion);
      // #endregion
      expect(assertion).toBeTruthy();
    } catch (error: any) {
      expect(error).toBeDefined();
      if (!test.throws) {
        return expect(false).toBe(true);
      }
      if (falsePass) {
        falsePass = false;
        return expect(false).toBe(true);
      }
      const thrown = test.thrown;
      // #region Logs
      log('args', test.args);
      log('thrown', error);
      // #endregion
      thrown && expect(error).toEqual(thrown);
    }
  };
}

export const ttest = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
}: TestProps<F>) => {
  const spy = jest.fn<ThenArg<ReturnType<F>>, Parameters<F>>(func);
  const mapper = mapperTest({ spy, compare });
  tests.forEach(test => {
    const invite = `${test.invite ?? nanoid()} ==>`;
    it(invite, async () => {
      await mapper(test);
    });
  });
  // const tests = _tests.forEach(mapper);
  const len = tests.length;

  it(`${func.name} should be call ${len} times`, () => {
    expect(spy).toBeCalledTimes(len);
  });
  return spy;
};

ttest.skip = <F extends NFunction = NFunction>({ func }: TestProps<F>) => {
  const spy = jest.fn<ThenArg<ReturnType<F>>, Parameters<F>>(func);
  return spy;
};

ttest.concurrent = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
}: TestProps<F>) => {
  const spy = jest.fn<ThenArg<ReturnType<F>>, Parameters<F>>(func);
  const mapper = mapperTest({ spy, compare });
  tests.forEach(test => {
    const invite = `${test.invite ?? nanoid()} ==>`;
    it.concurrent(invite, () => {
      mapper(test);
    });
  });
  const len = tests.length;

  it(`${func.name} should be call ${len} times`, () => {
    expect(spy).toBeCalledTimes(len);
  });
  return spy;
};

ttest.only = <F extends NFunction = NFunction>({
  func,
  tests,
  compare = dataCompare,
}: TestProps<F>) => {
  const spy = jest.fn<ThenArg<ReturnType<F>>, Parameters<F>>(func);
  const mapper = mapperTest({ spy, compare });
  tests.forEach(test => {
    const invite = `${test.invite ?? nanoid()} ==>`;
    it.only(invite, () => {
      mapper(test);
    });
  });
  // const tests = _tests.forEach(mapper);
  const len = tests.length;

  it.only(`${func.name} should be call ${len} times`, () => {
    expect(spy).toBeCalledTimes(len);
  });
  return spy;
};
