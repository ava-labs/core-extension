import { cloneDeep, get, update } from 'lodash';

import { base64UrlToBuffer } from '@src/utils/encoding';

import { DecodedFIDOResult, EncodedFIDOResult } from './types';

// Result properties that are known to contain Base64Url-encoded
// values. We need these values to be converted back to Buffers
// to satisfy CubeSigner's SDK.
const KNOWN_BUFFER_PROPERTIES = [
  'rawId',
  'response.clientDataJSON',
  'response.attestationObject',
  'response.authenticatorData',
  'response.signature',
  'response.userHandle',
];

export function convertResult(result: EncodedFIDOResult): DecodedFIDOResult {
  const copy = cloneDeep(result);

  KNOWN_BUFFER_PROPERTIES.forEach((path) => {
    // If object does not contain given property or it is nullish,
    // do nothing with it.
    const currentValue = get(copy, path);

    if (currentValue === undefined || currentValue === null) {
      return;
    }

    // Otherwise, convert it to Buffer
    update(copy, path, base64UrlToBuffer);
  });

  return copy as unknown as DecodedFIDOResult;
}
