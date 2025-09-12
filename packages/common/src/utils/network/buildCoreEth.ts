import { NetworkVMType } from '@avalabs/vm-module-types';
import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';

import { CoreEthNetwork, NetworkWithCaipId } from '@core/types';

export const buildCoreEth = (
  cChain?: NetworkWithCaipId,
): CoreEthNetwork | undefined => {
  if (!cChain) return;

  return {
    ...cChain,
    caipId: cChain.isTestnet
      ? AvalancheCaip2ChainId.C_TESTNET
      : AvalancheCaip2ChainId.C,
    vmName: NetworkVMType.CoreEth,
  };
};
