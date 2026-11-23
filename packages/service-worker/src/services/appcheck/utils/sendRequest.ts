import { getCoreApiKey } from '@core/common';

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

  const manifest = chrome.runtime.getManifest();
  const encodedManifest = Buffer.from(JSON.stringify(manifest)).toString(
    'base64',
  );
  const idServiceApiKey = await getCoreApiKey('idService');

  return fetch(`${url}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Version': manifest.version,
      'X-App-Type': 'extension',
      'X-App-Manifest': encodedManifest,
      ...(idServiceApiKey && { 'X-Api-Key': idServiceApiKey }),
    },
    body: JSON.stringify(payload),
    ...(timeout && { signal: AbortSignal.timeout(timeout) }),
  });
};
