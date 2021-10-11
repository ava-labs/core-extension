const zip = require('bestzip');
const pjson = require('./package.json');
const fs = require('fs');

const { version } = pjson;

if (!fs.existsSync('builds')) {
  fs.mkdirSync('builds');
}

zip({
  cwd: 'dist',
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
