import { createHash } from 'crypto';
import { readdir, readFile } from 'node:fs/promises';

const dir = 'dist';
const pathChecksumMap = {};
const manifestBytes = await readFile(`${dir}/manifest.json`);
const manifest = JSON.parse(manifestBytes.toString('utf-8'));
const encodedManifest = Buffer.from(manifestBytes).toString('base64');

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
    const pathWithoutDist = path.replace(/^(dist)\//, '');

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
