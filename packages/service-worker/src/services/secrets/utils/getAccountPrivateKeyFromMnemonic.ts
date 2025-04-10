import {
  DerivationPath,
  getWalletFromMnemonic,
} from '@avalabs/core-wallets-sdk';

export function getAccountPrivateKeyFromMnemonic(
  mnemonic: string,
  accountIndex: number,
  derivationPath: DerivationPath,
): string {
  const signer = getWalletFromMnemonic(mnemonic, accountIndex, derivationPath);
  if (!signer || !signer.path) {
    throw new Error('The requested path is missing');
  }

  return signer.privateKey;
}
