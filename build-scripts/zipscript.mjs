import zip from 'bestzip';
import pjson from '../package.json' with { type: 'json' };
import fs from 'fs';
import { readCoreCliArgument } from './readCoreCliArgument.mjs';

const { version } = pjson;

if (!fs.existsSync('builds')) {
  fs.mkdirSync('builds');
}

const gen = readCoreCliArgument('gen') || 'legacy';
const cwd = gen === 'legacy' ? 'dist' : 'dist-next';

zip({
  cwd,
  source: '*',
  destination: `../builds/avalanche-wallet-extension-${gen}-${version}.zip`,
})
  .then(() => {
    console.log(`version ${version} successfully created in /builds`);
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
