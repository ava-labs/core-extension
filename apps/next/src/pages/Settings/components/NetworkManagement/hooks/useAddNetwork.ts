import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { isNetworkValid } from '../components/NetworkForm/utils/isNetworkValid';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useMemo, useState } from 'react';
import { useNetworkContext } from '@core/ui';
import { NetworkFormFieldInfo } from '../components/NetworkForm/types';

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
  const { saveCustomNetwork } = useNetworkContext();
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
  const submit = () => {
    saveCustomNetwork(network);
  };

  const fieldInfo: NetworkFormFieldInfo = useMemo(() => {
    return {
      rpcUrl: {
        required: true,
        error: errors.rpcUrl,
        canReset: false,
      },
      chainName: {
        required: true,
        error: errors.chainName,
        canReset: false,
      },
      chainId: {
        required: true,
        error: errors.chainId,
        canReset: false,
      },
      tokenSymbol: {
        required: true,
        error: errors.tokenSymbol,
        canReset: false,
      },
      tokenName: {
        required: true,
        error: errors.tokenName,
        canReset: false,
      },
      explorerUrl: {
        required: false,
        error: errors.explorerUrl,
        canReset: false,
      },
      logoUrl: {
        required: false,
        error: errors.logoUrl,
        canReset: false,
      },
      rpcHeaders: {
        required: false,
        error: errors.rpcHeaders,
        canReset: false,
      },
    };
  }, [errors]);

  return { network, isValid, errors, setNetwork, reset, submit, fieldInfo };
};
