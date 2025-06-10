import { createHash } from 'crypto';
import { readdir, readFile } from 'node:fs/promises';
import { readCoreCliArgument } from './readCoreCliArgument.mjs';

const gen = readCoreCliArgument('gen') || 'legacy';
const dir = gen === 'legacy' ? 'dist' : 'dist-next';
const pathChecksumMap = {};
const manifestBytes = await readFile(`${dir}/manifest.json`);
const manifest = JSON.parse(manifestBytes.toString('utf-8'));

const orderedManifest = new Map(
  Object.keys(manifest)
    .sort()
    .map((key) => [key, manifest[key]]),
);

const encodedManifest = Buffer.from(
  JSON.stringify(Array.from(orderedManifest.entries())),
).toString('base64');

const manifestHash = createHash('sha256').update(encodedManifest).digest('hex');

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
      .update(`${manifest.version}:${content}`)
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
      'X-App-Version': manifest.version,
      'X-Api-Key': process.env.ID_SERVICE_API_KEY,
    },
    body: JSON.stringify({
      manifest: manifestHash,
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
