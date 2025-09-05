import { NetworkVMType } from '@avalabs/vm-module-types';
import { FungibleAssetType, NetworkWithCaipId } from '@core/types';

export const getNativeAssetType = (
  network: NetworkWithCaipId,
): FungibleAssetType => {
  switch (network.vmName) {
    case NetworkVMType.EVM:
      return 'evm_erc20';
    case NetworkVMType.PVM:
      return 'pvm_native';
    case NetworkVMType.AVM:
      return 'avm_native';
    case NetworkVMType.SVM:
      return 'svm_spl';
    case NetworkVMType.BITCOIN:
      return 'btc_native';
    default:
      return 'unknown';
  }
};
