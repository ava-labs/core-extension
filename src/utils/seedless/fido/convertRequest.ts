import { bufferToBase64Url } from '@src/utils/encoding';

import { FIDOApiEndpoint, FIDOApiRequest } from './types';

const RP_ID = 'identity.core.app';
const RP_NAME = 'Core';

export function convertRequest(
  endpoint: FIDOApiEndpoint,
  options: FIDOApiRequest
): string {
  if (endpoint === FIDOApiEndpoint.Authenticate) {
    return JSON.stringify(
      { ...options, rpId: RP_ID },
      convertBuffersToBase64Url
    );
  }

  if (endpoint === FIDOApiEndpoint.Register) {
    return JSON.stringify(
      {
        ...options,
        rp: {
          name: RP_NAME,
          id: RP_ID,
        },
      },
      convertBuffersToBase64Url
    );
  }

  throw new Error('Unsupported FIDO identity endpoint');
}

function convertBuffersToBase64Url(
  this: Record<string, unknown>,
  key: string,
  value: any
) {
  const el = this[key];

  if (el instanceof Buffer) {
    return bufferToBase64Url(el);
  }

  return value;
}
