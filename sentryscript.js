const execFileSync = require('child_process').execFileSync;
const parse = require('shell-quote/parse');

if (process.argv.length === 2) {
  console.error('Version argument is missing.');
  process.exit(1);
}

const sourcemaps = execFileSync('find', [
  './dist',
  '-name',
  '*.js.map',
]).toString();

if (!sourcemaps.length) {
  console.error('Source maps are missing.');
  process.exit(1);
}

const version = process.argv[2];
const commands = [
  { cmd: 'sentry-cli', args: ['sourcemaps', 'inject', './dist'] },
  {
    cmd: 'sentry-cli',
    args: parse('sourcemaps upload --release="$VERSION" ./dist', {
      VERSION: version,
    }),
  },
  {
    cmd: 'find',
    args: ['./dist', '-name', '*.js.map', '-delete'],
  },
];

for (const { cmd, args } of commands) {
  execFileSync(cmd, args, { stdio: 'inherit' });
}

process.exit(0);
