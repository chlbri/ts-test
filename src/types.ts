import type {
  DeepPartial,
  LengthOf,
  NOmit,
  Primitive,
  ThenArg,
} from '@bemedev/types';

export type NFunction<R = any, P extends any[] = any[]> = (
  ...args: P
) => R;

export type AsyncFunction<
  R = Promise<any>,
  P extends any[] = any[],
> = NFunction<R, P>;

export type TestElement<F extends NFunction> = (LengthOf<
  Parameters<F>
> extends 0
  ? {
      args?: never;
    }
  : LengthOf<Parameters<F>> extends 1
  ? {
      args: Parameters<F>[0];
    }
  : 0 extends LengthOf<Parameters<F>>
  ? {
      args?: LengthOf<Parameters<F>> extends 0 | 1
        ? Parameters<F>[0]
        : Parameters<F>;
    }
  : {
      args: Parameters<F>;
    }) &
  (
    | {
        throws?: false;
        expected?: ExpectedFromFunction<F>;
      }
    | { throws: true; thrown?: any }
  ) & {
    invite: string;
    compare?: CompareFromFunction<F>;
    weight?: TestWeight;
    context: string;
  };

export type Compare<T = any> = NFunction<
  boolean,
  [actual: T, expected?: Expected<T>]
>;

export type CompareFromFunction<F extends NFunction = NFunction> = Compare<
  ThenArg<ReturnType<F>>
>;

export type DeepExpected<T> =
  | DeepPartial<
      T extends {
        [key: string]: infer U;
      }
        ? U extends Primitive
          ? U | Und
          : DeepExpected<U>
        : Record<string, never> | Und
    >
  | Partial<Record<keyof T, Und>>;

export type ThenArgFromFunction<F extends NFunction = NFunction> = ThenArg<
  ReturnType<F>
>;

export type Expected<T> = DeepPartial<T> | DeepExpected<T>;

export type ExpectedFromFunction<F extends NFunction = NFunction> =
  | DeepPartial<ThenArgFromFunction<F>>
  | DeepExpected<ThenArgFromFunction<F>>;

export type TE<F extends NFunction> = TestElement<F>;

export type TestFunction<F extends NFunction> = (
  arg: TestElement<F>,
) => Promise<boolean>;

// export type JestMockFromFunction<F extends NFunction = NFunction> =
//   jest.Mock<ThenArgFromFunction<F>, Parameters<F>>;

export type Mapper<F extends NFunction> = {
  spy: JestFunction<F>;
  uuid?: boolean;
  compare: CompareFromFunction<F>;
};

export type TestProps<F extends NFunction = NFunction> = {
  func: F;
  tests: TestElement<F>[];
  compare?: CompareFromFunction<F>;
};

export type TestTable<F extends NFunction> = TestElement<F>[];

export const UND = {
  value: undefined,
  x_type: 'und',
} as const;

export const TEST_ERROR = {
  value: undefined,
  x_type: 'error',
} as const;

type Und = typeof UND;

export type TestWeight = 1 | 2 | 3 | 4 | 5;

export type TestState =
  | 'passed'
  | 'failed'
  | 'skipped'
  | 'pending'
  | 'todo'
  | 'disabled';

export type CommonTest = {
  weight: TestWeight;
  invite: string;
};

export type JestFunction<F extends NFunction> = jest.Mock<
  ThenArgFromFunction<F>,
  Parameters<F>
>;

export type TestResult = {
  state: TestState;
  weight: TestWeight;
  invite: string;
  parent?: string;
};
export type TestResultWithID = TestResult & {
  ID: number;
};

export type GroupResult = {
  invite: string;
  weight: TestWeight;
  parent?: string;
};

export type GroupResultWithID = GroupResult & {
  ID: number;
};

export type GroupWithResults = GroupResultWithID & {
  tests: number[];
  groups: number[];
};

export type GroupWithResultsAndRank = GroupWithResults & {
  rank: number; // Start from 1, integer only
};

export type GroupWeighted = NOmit<GroupResultWithID, 'weight'> & {
  rank: number; // Start from 1, integer only
  tests: number[];
  weight: number;
  groups: number[];
};

export type AchievementTest = {
  invite: string;
  weight: TestWeight;
  state: TestState;
  context?: string;
};

export type AchievementGroup = NOmit<AchievementTest, 'state'> & {
  state: number; //Between 1 and 0
};

export type Achievement = AchievementTest | AchievementGroup;

export type ExplodeGroupBanksReturn = [number, number[]][];

export type JestTest = {
  weight: TestWeight;
  invite: string;
  iterator: number;
  context?: string;
};
type AssertionResult = {
  ancestorTitles: Array<string>;
  duration?: number | null;
  failureDetails: Array<unknown>;
  failureMessages: Array<string>;
  numPassingAsserts: number;
  retryReasons?: Array<string>;
  status: TestState;
  title: string;
};

export type ReducerToAchieve = (test: AssertionResult) => AchievementTest;

export type Context = {
  label: string;
  weight: number;
  parent?: string;
  rank?: number;
  totalTests?: string[];
  failedTests?: string[];
  passedTests?: string[];
  skippedTests?: string[];
  pendingTests?: string[];
  todoTests?: string[];
  disabledTests?: string[];
  children?: Record<string, Context>;
};

export type ContextJSON = Context | Record<string, Context> | undefined;
