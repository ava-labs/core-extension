import { isDevelopment } from '@core/common';

type Params = {
  path: string;
  payload: Record<string, unknown>;
  timeout?: number;
};

export const sendRequest = async ({ path, payload, timeout }: Params) => {
  const url = process.env.ID_SERVICE_URL;

  if (!url) {
    throw new Error('ID_SERVICE_URL is missing');
  }

  const manifestResponse = await fetch(chrome.runtime.getURL('manifest.json'));
  const manifest = await manifestResponse.json();

  const orderedManifestKeys = Object.keys(manifest).sort();
  const orderedManifest = new Map(
    orderedManifestKeys.map((key) => [key, manifest[key]]),
  );

  const encodedManifest = Buffer.from(
    JSON.stringify(Array.from(orderedManifest.entries())),
  ).toString('base64');

  return fetch(`${process.env.ID_SERVICE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Version': chrome.runtime.getManifest().version,
      'X-App-Type': 'extension',
      'X-App-Manifest': encodedManifest,
      ...(isDevelopment() && {
        'X-Api-Key': process.env.ID_SERVICE_API_KEY ?? '',
      }),
    },
    body: JSON.stringify(payload),
    ...(timeout && { signal: AbortSignal.timeout(timeout) }),
  });
};
