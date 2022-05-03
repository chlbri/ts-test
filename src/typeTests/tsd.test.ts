import tsd from 'tsd';
import { log } from '../helpers';

const func = () =>
  tsd({
    cwd: process.cwd(),
    typingsFile: 'globals.d.ts',
    testFiles: ['src/**/*.test-d.ts'],
  });

test.concurrent(
  'TSD',
  async () => {
    const _received = await func();
    log('received', _received);
    const received = _received.length;
    const expected = 0;
    expect(received).toBe(expected);
  },
  1000,
);
