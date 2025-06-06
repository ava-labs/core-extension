import { createHash } from 'crypto';
import { readdir, readFile } from 'node:fs/promises';
import { readCoreCliArgument } from './readCoreCliArgument.mjs';

const gen = readCoreCliArgument('gen') || 'legacy';
const version = readCoreCliArgument('version') || '0.0.0';
const dir = gen === 'legacy' ? 'dist' : 'dist-next';
const pathChecksumMap = {};
const encodedManifest = (await readFile(`${dir}/manifest.json`)).toString(
  'base64',
);

const files = await readdir(dir, {
  withFileTypes: true,
  encoding: 'utf8',
  recursive: true,
});

for (const file of files) {
  if (
    file.isFile() &&
    file.name.endsWith('.js') &&
    !file.name.includes('node_modules')
  ) {
    const path = `${file.parentPath}/${file.name}`;
    const pathWithoutDist = path.replace(/^(dist-next|dist)\//, '');

    const content = await readFile(path, { encoding: 'base64' });
    const hash = createHash('sha256')
      .update(`${version}:${content}`)
      .digest('hex');

    pathChecksumMap[pathWithoutDist] = hash;
  }
}

const submitBuildResponse = await fetch(
  `${process.env.ID_SERVICE_URL}/v2/ext/submit-build`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Version': version,
      'X-Api-Key': process.env.ID_SERVICE_API_KEY,
    },
    body: JSON.stringify({
      manifest: encodedManifest,
      pathChecksumMap,
    }),
  },
);

if (!submitBuildResponse.ok) {
  console.error(
    `Submitting build failed with status ${submitBuildResponse.status}`,
  );
  process.exit(1);
}

process.exit(0);
