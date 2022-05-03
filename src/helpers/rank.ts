import { exec } from 'shelljs';

// let messageT = '';

exec('pnpm run test -- --config "./jest.config.custom.js"', {
  async: true,
  // fatal: true,
});
