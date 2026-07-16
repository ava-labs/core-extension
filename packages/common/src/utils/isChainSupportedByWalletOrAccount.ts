import {
  isChainSupportedByAccount,
  isChainSupportedByWallet,
} from '@core/common';
import { Account, NetworkWithCaipId, WalletDetails } from '@core/types';
import { NetworkVMType } from '@avalabs/vm-module-types';

export function isChainSupportedByWalletOrAccount(
  network: NetworkWithCaipId | undefined,
  wallet: WalletDetails | undefined,
  account: Account | undefined,
) {
  if (!network) {
    return false;
  }

  return wallet
    ? // chains-sdk NetworkVMType lags vm-module-types (e.g. HYPERCORE); values are identical strings.
      isChainSupportedByWallet(
        network.vmName as unknown as NetworkVMType,
        wallet.type,
      )
    : isChainSupportedByAccount(network, account);
}
