import { ttest } from './functions';
import { identityCompare } from './helpers';

function func3() {
  return 1;
}

describe('Func3', () => {
  ttest.only({
    func: func3,
    tests: [{ expected: 1 }, { expected: 1 }, { expected: 1 }],
    compare: identityCompare,
  });
});
