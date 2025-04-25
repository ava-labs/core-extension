import { bufferToBase64Url } from '@core/utils';

import { FIDOApiEndpoint, FIDOApiRequest } from '@core/types';

export function convertRequest(
  endpoint: FIDOApiEndpoint,
  options: FIDOApiRequest,
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
  value: any,
) {
  const el = this[key];

  if (el instanceof Buffer) {
    return bufferToBase64Url(el);
  }

  return value;
}
