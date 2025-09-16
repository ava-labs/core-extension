import { isNetworkValid } from '../components/NetworkForm/utils/isNetworkValid';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useAnalyticsContext, useNetworkContext } from '@core/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const { removeCustomNetwork, getNetwork } = useNetworkContext();
  const { capture } = useAnalyticsContext();

  const [isEditing, setIsEditing] = useState(false);

  const original = getNetwork(networkId);

  const { isCustomNetwork, saveCustomNetwork, updateDefaultNetwork } =
    useNetworkContext();

  const [network, setNetwork] = useState<
    (Network & AdvancedNetworkConfig) | undefined
  >(original);

  useEffect(() => {
    // When original changes, set the editable network to the original
    setNetwork(original);
  }, [original]);

  const isCustom = network ? isCustomNetwork(network.chainId) : false;

  const { isValid, errors } = network
    ? isNetworkValid(network)
    : { isValid: false, errors: {} };

  const reset = useCallback(() => {
    setNetwork(original);
  }, [original, setNetwork]);

  const submit = useCallback(async () => {
    if (!network) {
      return;
    }

    if (isCustom) {
      await saveCustomNetwork(network);
      capture('CustomNetworkEdited');
      return;
    }

    await updateDefaultNetwork(network);
    capture('DefaultNetworkRPCEdited');
  }, [capture, isCustom, network, saveCustomNetwork, updateDefaultNetwork]);

  const resetRpcUrl = useCallback(async () => {
    if (!network) return;
    const { rpcUrl, ...networkToSubmit } = network;
    await updateDefaultNetwork(networkToSubmit);
    capture('DefaultNetworkRPCReset');
  }, [capture, network, updateDefaultNetwork]);

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
