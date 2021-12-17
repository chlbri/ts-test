// #region Config

import { ttest } from './functions';
import { identityCompare } from './helpers';

function func1(a: number, b: number) {
  return a + b;
}

function func2(a: number) {
  return a ** 2;
}

function func3() {
  return 1;
}

function throws(val: number) {
  if (val === 3) {
    throw val;
  }
  if (val === 2) {
    throw val;
  }
  return val;
}

// #endregion

describe('Func1', () => {
  ttest({
    func: func1,
    tests: [
      { args: [18, 42], expected: 60 },
      { args: [15, 35], expected: 50 },
      { args: [95, 5], expected: 100 },
    ],
  });
});

describe('throws', () => {
  ttest({
    func: throws,
    tests: [
      {
        invite: 'Pour 2',
        args: 2,
        throws: true,
        thrown: 2,
      },

      { args: 3, throws: true },
      // { args: 5, throws: true },
    ],
  });
});

describe('Func2', () => {
  ttest({
    func: func2,
    tests: [
      { args: 4, expected: 16 },
      { args: 5, expected: 25 },
      { args: 7, expected: 49 },
    ],
    compare: identityCompare,
  });
});

describe('Func3', () => {
  ttest({
    func: func3,
    tests: [{ expected: 1 }, { expected: 1 }, { expected: 1 }],
    compare: identityCompare,
  });
});
