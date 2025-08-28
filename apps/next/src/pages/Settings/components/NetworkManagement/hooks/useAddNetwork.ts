import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { isNetworkValid } from '../components/NetworkForm/utils/isNetworkValid';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useMemo, useState } from 'react';

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

  const { isValid, errors } = useMemo(() => {
    console.log('running validation');
    return isNetworkValid(network);
  }, [network]);

  const reset = () => {
    setNetwork(defaultNetworkValues);
  };

  return { network, isValid, errors, setNetwork, reset };
};
