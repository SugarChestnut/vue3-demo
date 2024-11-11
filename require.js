import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('ts-node/esm', pathToFileURL('./'));

// node --import=./require.js --trace-deprecation test/type.ts