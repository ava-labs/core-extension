const zip = require('bestzip');
const pjson = require('./package.json');
const fs = require('fs');

const { version } = pjson;

fs.mkdirSync('builds');

zip({
  cwd: 'dist',
  source: '*',
  destination: `../builds/ava-v${version}.zip`,
})
  .then(() => {
    console.log(`version ${version} successfully created in /builds`);
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
