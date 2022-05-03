import { nanoid } from 'nanoid';
import { mapperTest } from '../functions';
import {
  AchievementTest,
  CompareFromFunction,
  GroupResultWithID,
  GroupWithResults,
  JestFunction,
  JestTest,
  NFunction,
  TestElement,
  TestFunction,
  TestResult,
  TestWeight,
} from '../types';

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
