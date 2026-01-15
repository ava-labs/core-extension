import zip from 'bestzip';
import pjson from '../package.json' with { type: 'json' };
import fs from 'fs';

const { version } = pjson;

if (!fs.existsSync('builds')) {
  fs.mkdirSync('builds');
}

const cwd = 'dist';

zip({
  cwd,
  source: '*',
  destination: `../builds/avalanche-wallet-extension.zip`,
})
  .then(() => {
    console.log(`version ${version} successfully created in /builds`);
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
