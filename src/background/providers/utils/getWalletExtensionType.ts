import { WalletExtensionType } from '../../services/web3/models';

// using any since we don't really know what properties other wallets define
export function getWalletExtensionType(provider: any): WalletExtensionType {
  if (provider.isAvalanche) {
    return WalletExtensionType.CORE;
  }
  if (provider.isRabby) {
    return WalletExtensionType.RABBY;
  }
  if (provider.isCoinbaseWallet) {
    return WalletExtensionType.COINBASE;
  }
  if (provider.isMetaMask) {
    return WalletExtensionType.METAMASK;
  }
  return WalletExtensionType.UNKNOWN;
}
