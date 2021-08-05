import { WalletType } from '@avalabs/avalanche-wallet-sdk';

export function getAccountsFromWallet(wallet: WalletType) {
  return [wallet.getAddressC()];
}
