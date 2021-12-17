import { log, ThenArg } from '@core_chlbri/core';
import { nanoid } from 'nanoid';
import { dataCompare } from './helpers/compares';
import type { Mapper, NFunction, TestFunction, TestProps } from './types';

export function mapperTest<F extends NFunction>({
  spy,
  compare,
}: Mapper<F>): TestFunction<F> {
  return async test => {
    const _spy = spy as jest.Mock<Promise<any>>;
    if (!test.throws) {
      let _processed: any;
      if (spy.length == 0) {
        _processed = await _spy();
      } else if (spy.length === 1) {
        _processed = await _spy(test.args);
      } else {
        _processed = await _spy(...(test.args as any));
      }
      const assertion = compare(_processed, test.expected);
      log('args', test.args);
      log('expected', test.expected);
      log('_processed', _processed);
      log('assertion', assertion);

      expect(assertion).toBeTruthy();
    } else {
      const _processed = async () => {
        if (spy.length === 0) {
          return await _spy();
        } else if (spy.length === 1) {
          return await _spy(test.args);
        } else {
          return await _spy(...(test.args as any));
        }
      };
      // expect.assertions(1);
      // expect(_processed()).rejects.toEqual(test)
      try {
        await _processed();
      } catch (error) {
        const thrown = test.thrown;
        log('args', test.args);
        log('thrown', thrown);
        expect(error).toBeDefined();
        thrown && expect(error).toEqual(thrown);
      }
    }

    // expect(spy).toBeCalledWith(...args);
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
