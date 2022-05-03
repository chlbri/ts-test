import { UND } from './constants';
import { ttest } from './functions';
import { identityCompare, shallowCompare } from './helpers';

function func1(a: number, b: number) {
  return a + b;
}

function func2(a: number) {
  return a ** 2;
}

function func3() {
  return 1;
}

function func4(d?: unknown) {
  const check = d === UND;
  return check ? undefined : { a: 1, b: 'two', c: true, d };
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
  ttest({
    func: func1,
    tests: [
      { args: [18, 42], expected: 60, invite: '#1' },
      { args: [15, 35], expected: 50, invite: '#2' },
      { args: [95, 5], expected: 100, invite: '#3' },
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

      { invite: 'Pour 3', args: 3, throws: true },
      { invite: 'Pour 5', args: 5, expected: 5 },
      // { args: 5, throws: true },
    ],
  });
});

describe('Func2', () => {
  ttest({
    func: func2,
    tests: [
      { args: 4, expected: 16, invite: '#1' },
      { args: 5, expected: 25, invite: '#2' },
      { args: 7, expected: 49, invite: '#3' },
    ],
    compare: identityCompare,
  });
});

describe('Func3', () => {
  ttest({
    func: func3,
    tests: [
      { expected: 1, invite: '#1' },
      { expected: 1, invite: '#2' },
      { expected: 1, invite: '#3' },
    ],
    compare: identityCompare,
  });
});

describe('Func4', () => {
  ttest({
    func: func4,
    tests: [
      { expected: { d: UND }, invite: '#1' },
      { args: 4, expected: { c: true }, invite: '#2' },
      { expected: UND, args: UND, invite: '#3' },
      { args: UND, invite: '#4' },
      { invite: '#5' },
    ],
    compare: shallowCompare,
  });
  describe('Name of the group', () => {
    ttest({
      func: func4,
      tests: [
        { expected: { d: UND }, invite: '#1' },
        {
          args: 4,
          expected: { c: true },
          invite: '#2',
        },
        { expected: UND, args: UND, invite: '#3' },
        { args: UND, invite: '#4' },
        { invite: '#5' },
      ],
      compare: shallowCompare,
    });
  });
});
