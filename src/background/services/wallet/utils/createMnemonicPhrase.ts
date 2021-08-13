import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';

export function createNewMnemonic() {
  return MnemonicWallet.generateMnemonicPhrase();
}
