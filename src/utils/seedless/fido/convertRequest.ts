import { bufferToBase64Url } from '@src/utils/encoding';

import { FIDOApiEndpoint, FIDOApiRequest } from './types';

export function convertRequest(
  endpoint: FIDOApiEndpoint,
  options: FIDOApiRequest
): string {
  if (
    endpoint === FIDOApiEndpoint.Authenticate ||
    endpoint === FIDOApiEndpoint.Register
  ) {
    return JSON.stringify(options, convertBuffersToBase64Url);
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