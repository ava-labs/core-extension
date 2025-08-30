import { isNetworkValid } from '../components/NetworkForm/utils/isNetworkValid';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useEffect, useMemo, useState } from 'react';
import { NetworkFormFieldInfo } from '../components/NetworkForm/types';
import { DynamicFields, mergeDynamicFields } from './utils/fieldInfo';

type UseEditNetworkProps = {
  networkId: number;
  rpcUrlResetButtonAction?: () => void;
};

export const useEditNetwork = ({
  networkId,
  rpcUrlResetButtonAction: rpcUrlResetAction,
}: UseEditNetworkProps) => {
  const { networks, removeCustomNetwork } = useNetworkContext();

  const [isEditing, setIsEditing] = useState(false);

  const original = useMemo(() => {
    return networks.find((n) => n.chainId === Number(networkId));
  }, [networks, networkId]);

  const { isCustomNetwork, saveCustomNetwork, updateDefaultNetwork } =
    useNetworkContext();

  const [network, setNetwork] = useState<
    (Network & AdvancedNetworkConfig) | undefined
  >(original);

  useEffect(() => {
    // When original changes, set the editable network to the original
    setNetwork(original);
  }, [original]);

  const isCustom = useMemo(() => {
    if (!network) return false;
    return isCustomNetwork(network.chainId);
  }, [isCustomNetwork, network]);

  const { isValid, errors } = useMemo(() => {
    if (!network) return { isValid: false, errors: {} };
    return isNetworkValid(network);
  }, [network]);

  const reset = () => {
    setNetwork(original);
  };
  const submit = () => {
    if (!network) return;
    if (isCustom) {
      saveCustomNetwork(network);
    } else {
      updateDefaultNetwork(network);
    }
  };

  const resetRpcUrl = () => {
    if (!network) return;
    const { rpcUrl, ...networkToSubmit } = network;
    updateDefaultNetwork(networkToSubmit);
  };

  const fieldInfo: NetworkFormFieldInfo = useMemo(() => {
    const dynamicFields: DynamicFields = {
      rpcUrl: {
        error: errors.rpcUrl,
        resetAction: rpcUrlResetAction,
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
  }, [errors, rpcUrlResetAction]);

  return {
    network,
    isValid,
    isCustom,
    fieldInfo,
    setNetwork,
    reset,
    resetRpcUrl,
    submit,
    isEditing,
    setIsEditing,
    removeCustomNetwork,
  };
};
