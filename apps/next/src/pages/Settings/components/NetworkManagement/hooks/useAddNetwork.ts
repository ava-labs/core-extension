import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { isNetworkValid } from '@core/common';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useState } from 'react';

const defaultNetworkValues: Network & AdvancedNetworkConfig = {
  chainName: '',
  chainId: 0,
  vmName: NetworkVMType.EVM,
  rpcUrl: '',
  networkToken: {
    name: '',
    symbol: '',
    description: '',
    decimals: 18,
    logoUri: '',
  },
  logoUri: '',
  explorerUrl: '',
  customRpcHeaders: undefined,
};

export const useAddNetwork = () => {
  const [network, setNetwork] = useState<Network & AdvancedNetworkConfig>(
    defaultNetworkValues,
  );

  const { valid: isValid } = isNetworkValid(network);

  const reset = () => {
    setNetwork(defaultNetworkValues);
  };

  return { network, isValid, setNetwork, reset };
};
