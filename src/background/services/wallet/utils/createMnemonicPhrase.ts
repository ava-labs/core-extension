import { Mnemonic } from 'ethers';

export function createNewMnemonic(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return Mnemonic.entropyToPhrase(randomBytes);
}
