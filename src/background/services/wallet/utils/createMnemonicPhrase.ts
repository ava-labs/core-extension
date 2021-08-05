import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';

export function createNewMnemonic() {
  MnemonicWallet.create();
  return MnemonicWallet.generateMnemonicPhrase();
}
