import tsd from 'tsd';

const func = () =>
  tsd({
    cwd: process.cwd(),
    typingsFile: 'globals.d.ts',
    testFiles: ['src/**/*.test-d.ts'],
  });
