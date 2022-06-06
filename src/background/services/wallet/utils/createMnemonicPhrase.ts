import { Wallet } from 'ethers';

export function createNewMnemonic() {
  return Wallet.createRandom().mnemonic.phrase;
}
