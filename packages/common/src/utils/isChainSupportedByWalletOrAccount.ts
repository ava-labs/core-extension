import {
  isChainSupportedByAccount,
  isChainSupportedByWallet,
} from '@core/common';
import { Account, NetworkWithCaipId, WalletDetails } from '@core/types';

export function isChainSupportedByWalletOrAccount(
  network: NetworkWithCaipId | undefined,
  wallet: WalletDetails | undefined,
  account: Account | undefined,
) {
  if (!network) {
    return false;
  }

  return wallet
    ? isChainSupportedByWallet(network.vmName, wallet.type)
    : isChainSupportedByAccount(network, account);
}
