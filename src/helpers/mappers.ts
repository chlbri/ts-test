import {
  AchievementTest,
  GroupResult,
  GroupResultWithID,
  GroupWithResults,
  JestTest,
  TestResult,
  TestWeight,
} from '../types';

export function mapperID<T extends TestResult | GroupResult>(ID: number) {
  return (result: T, ..._: any) => ({
    ...result,
    ID,
  });
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

export function mapperJest({
  invite,
  iterator,
  weight,
  context,
}: JestTest) {
  return JSON.stringify({ invite, iterator, weight, context });
}
