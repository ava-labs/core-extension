import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { isNetworkValid } from '@core/common';
import { Network } from '@core/types';
import { useState } from 'react';

const defaultNetworkValues: Network = {
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
};

export const useAddNetwork = () => {
  const [network, setNetwork] = useState<Network>(defaultNetworkValues);

  const { valid: isValid } = isNetworkValid(network);

  const reset = () => {
    setNetwork(defaultNetworkValues);
  };

  return { network, isValid, setNetwork, reset };
};
