import { ttest } from './functions';
import { identityCompare } from './helpers';

function func3() {
  return 1;
}

describe('Func3', () => {
  ttest.only({
    func: func3,
    tests: [
      { expected: 1, invite: '#1' },
      { expected: 1, invite: '#2' },
      { expected: 1, invite: '#3' },
    ],
    compare: identityCompare,
  });
});
