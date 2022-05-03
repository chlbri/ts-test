import { exec } from 'shelljs';

// let messageT = '';

exec('npm run test -- --silent', { async: true, fatal: true });
