import { entropyToMnemonic } from 'ethers/lib/utils';

export function createNewMnemonic() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return entropyToMnemonic(randomBytes);
}
