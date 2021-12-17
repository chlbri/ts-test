// #region Config

import { ttest } from './functions';
import { identityCompare } from './helpers';

function func2(a: number) {
  return a ** 2;
}

// #endregion

const func = ttest.skip({
  func: func2,
  tests: [
    { args: 4, expected: 16 },
    { args: 5, expected: 25 },
    { args: 7, expected: 49 },
  ],
  compare: identityCompare,
});

it('Skip not call', () => {
  expect(func).toBeCalledTimes(0);
});
