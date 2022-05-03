import { nanoid } from 'nanoid';
import { TEST_ERROR } from '../constants';
import type {
  AchievementTest,
  CompareFromFunction,
  GroupResultWithID,
  GroupWithResults,
  JestFunction,
  JestTest,
  Mapper,
  NFunction,
  TestElement,
  TestFunction,
  TestResult,
  TestWeight,
} from '../types';

export function log(text: string, arg: any) {
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

export function mapperWithResult(
  group: GroupResultWithID,
): GroupWithResults {
  return {
    ...group,
    tests: [],
    groups: [],
  };
}

export function mapperTestAchievement(
  weight: TestWeight,
): (test: TestResult) => AchievementTest {
  return ({ invite, state }) => ({
    invite,
    state,
    weight,
  });
}

export function computeInvite({ invite, iterator }: JestTest) {
  return `${iterator}-/ ${invite ?? nanoid(7)}`;
}

export function mapperTests<F extends NFunction = NFunction>(
  func: F,
  compare: CompareFromFunction<F>,
  tests: TestElement<F>[],
  tester: jest.It,
  timeout?: number,
) {
  const spy = jest.fn(func) as JestFunction<F>;
  const mapper = mapperTest({ spy, compare });
  tests.forEach(mapperJest(mapper, tester, timeout));
  return spy;
}

function mapperJest<F extends NFunction = NFunction>(
  mapper: TestFunction<F>,
  tester: jest.It,
  timeout?: number,
): (value: TestElement<F>, index: number) => void {
  return (test, iterator) => {
    const invite = computeInvite({
      ...test,
      iterator,
    });
    tester(
      invite,
      async () => {
        await mapper(test);
      },
      test.timeout ?? timeout,
    );
  };
}
