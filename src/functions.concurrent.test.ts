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

describe('Func1', () => {
  ttest.concurrent({
    func: func1,
    tests: [
      {
        args: [18, 42],
        expected: 60,
        invite: '#1',
        context: 'concurrent',
      },
      {
        args: [15, 35],
        expected: 50,
        invite: '#2',
        context: 'concurrent',
      },
      {
        args: [95, 5],
        expected: 100,
        invite: '#3',
        context: 'concurrent',
      },
    ],
  });
});

describe('throws', () => {
  ttest.concurrent({
    func: throws,
    tests: [
      {
        invite: 'Pour 2',
        args: 2,
        throws: true,
        thrown: 2,
        context: 'concurrent',
      },

      { args: 3, throws: true, invite: 'Pour 3', context: 'concurrent' },
      // { args: 5, throws: true },
    ],
  });
});

describe('Func2', () => {
  ttest({
    func: func2,
    tests: [
      { args: 4, expected: 16, invite: '#1', context: 'concurrent' },
      { args: 5, expected: 25, invite: '#2', context: 'concurrent' },
      { args: 7, expected: 49, invite: '#3', context: 'concurrent' },
    ],
    compare: identityCompare,
  });
});

describe('Func3', () => {
  ttest.concurrent({
    func: func3,
    tests: [
      { expected: 1, invite: '#1', context: 'concurrent' },
      { expected: 1, invite: '#2', context: 'concurrent' },
      { expected: 1, invite: '#3', context: 'concurrent' },
    ],
    compare: identityCompare,
  });
});
