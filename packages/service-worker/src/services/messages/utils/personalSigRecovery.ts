import { recoverPersonalSignature } from '@metamask/eth-sig-util';

/**
 * Gets the "from" address from the data and the signed result .
 */
export function personalSigRecovery(msg: string, signedResult: string): string {
  const recoveredAddress = recoverPersonalSignature({
    data: msg,
    signature: signedResult,
  });
  return recoveredAddress;
}
