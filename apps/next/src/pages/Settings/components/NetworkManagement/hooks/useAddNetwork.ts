import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { isNetworkValid } from '../components/NetworkForm/utils/isNetworkValid';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useMemo, useState } from 'react';
import { useNetworkContext } from '@core/ui';
import { NetworkFormFieldInfo } from '../components/NetworkForm/types';
import { DynamicFields, mergeDynamicFields } from './utils/fieldInfo';

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
    const dynamicFields: DynamicFields = {
      rpcUrl: {
        error: errors.rpcUrl,
      },
      chainName: {
        error: errors.chainName,
      },
      chainId: {
        error: errors.chainId,
      },
      tokenSymbol: {
        error: errors.tokenSymbol,
      },
      tokenName: {
        error: errors.tokenName,
      },
      explorerUrl: {
        error: errors.explorerUrl,
      },
      logoUrl: {
        error: errors.logoUrl,
      },
      rpcHeaders: {
        error: errors.rpcHeaders,
      },
    };
    return mergeDynamicFields(dynamicFields);
  }, [errors]);

  return { network, isValid, errors, setNetwork, reset, submit, fieldInfo };
};
