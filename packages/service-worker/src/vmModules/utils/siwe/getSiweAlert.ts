import { RpcMethod } from '@avalabs/vm-module-types';
import type {
  DisplayData,
  RpcRequest,
  SigningData,
} from '@avalabs/vm-module-types';

import { parseSiweMessage } from './parseSiweMessage';
import { validateSiweOrigin } from './validateSiweOrigin';

/**
 * For personal_sign requests, checks whether the message is a SIWE (EIP-4361)
 * message and validates that its domain/URI matches the requesting dApp.
 *
 * Returns an updated displayData with an alert injected if there is a mismatch,
 * or the original displayData if no issue is found.
 */
export function maybeInjectSiweAlert({
  request,
  signingData,
  displayData,
}: {
  request: RpcRequest;
  signingData: SigningData;
  displayData: DisplayData;
}): DisplayData {
  if (signingData.type !== RpcMethod.PERSONAL_SIGN) return displayData;

  // Already has an alert from simulation/Blockaid — don't override it
  if (displayData.alert) return displayData;

  const message = decodePersonalSignMessage(signingData.data);
  if (!message) return displayData;

  const siwe = parseSiweMessage(message);
  if (!siwe) return displayData;

  const alert = validateSiweOrigin(siwe, request.dappInfo.url);
  if (!alert) return displayData;

  return { ...displayData, alert };
}

const HEX_REGEX = /^0x(?:[0-9a-fA-F]{2})*$/;

/**
 * personal_sign accepts either a 0x-prefixed hex string or a plain UTF-8
 * string (the evm-module signs the raw string when it isn't hex), so the
 * SIWE check has to understand both encodings. Hex that doesn't decode to
 * valid UTF-8 can't be a SIWE message.
 */
export function decodePersonalSignMessage(data: unknown): string | undefined {
  if (typeof data !== 'string' || data.length === 0) return undefined;

  if (!HEX_REGEX.test(data)) return data;

  try {
    const bytes = new Uint8Array(
      data
        .slice(2)
        .match(/.{2}/g)
        ?.map((byte) => parseInt(byte, 16)) ?? [],
    );
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return undefined;
  }
}
