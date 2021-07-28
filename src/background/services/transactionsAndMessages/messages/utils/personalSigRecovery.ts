import { recoverPersonalSignature } from 'eth-sig-util';

/**
 * Gets the "from" address from the data and the signed result .
 */
export function personalSigRecovery(msg: string, signedResult: string): string {
  const recoveredAddress = recoverPersonalSignature({
    data: msg,
    sig: signedResult,
  });
  return recoveredAddress;
}
