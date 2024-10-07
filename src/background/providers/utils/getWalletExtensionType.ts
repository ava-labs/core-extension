import { WalletExtensionType } from '../../services/web3/models';

// using any since we don't really know what properties other wallets define
export function getWalletExtensionType(provider: any): WalletExtensionType {
  console.log('provider: ', provider);
  if (provider.isAvalanche) {
    return WalletExtensionType.CORE;
  }
  if (provider.isPhantom) {
    return WalletExtensionType.PHANTOM;
  }
  if (provider.isKeplr) {
    return WalletExtensionType.KEPLR;
  }
  if (provider.isZerion) {
    return WalletExtensionType.ZERION;
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
