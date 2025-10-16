import { Avalanche } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

export const getAvalancheProvider = (network: NetworkWithCaipId) => {
  if (
    network.vmName !== NetworkVMType.AVM &&
    network.vmName !== NetworkVMType.PVM &&
    network.vmName !== NetworkVMType.CoreEth
  ) {
    throw new Error('Network is not an Avalanche network');
  }

  return network.isTestnet
    ? Avalanche.JsonRpcProvider.getDefaultFujiProvider()
    : Avalanche.JsonRpcProvider.getDefaultMainnetProvider();
};
