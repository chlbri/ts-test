import { ttest } from './functions';
import { identityCompare } from './helpers';

function func2(a: number) {
  return a ** 2;
}

const spy = ttest.skip({
  func: func2,
  tests: [
    { args: 4, expected: 16, invite: '#1', context: 'skip' },
    { args: 5, expected: 25, invite: '#2', context: 'skip' },
    { args: 7, expected: 49, invite: '#3', context: 'skip' },
  ],
  compare: identityCompare,
});

it('Skip not call', () => {
  expect(spy).not.toHaveBeenCalled();
});
