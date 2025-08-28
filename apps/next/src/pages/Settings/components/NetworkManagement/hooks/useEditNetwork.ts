import { isNetworkValid } from '../components/NetworkForm/utils/isNetworkValid';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { useMemo, useState } from 'react';
import { NetworkFormFieldInfo } from '../components/NetworkForm/types';

type UseEditNetworkProps = {
  selectedNetwork?: Network & AdvancedNetworkConfig;
  rpcUrlResetAction?: () => void;
};

export const useEditNetwork = ({
  selectedNetwork,
  rpcUrlResetAction,
}: UseEditNetworkProps) => {
  const { isCustomNetwork, saveCustomNetwork, updateDefaultNetwork } =
    useNetworkContext();
  const original = selectedNetwork ? { ...selectedNetwork } : undefined;

  const [network, setNetwork] = useState<
    (Network & AdvancedNetworkConfig) | undefined
  >(selectedNetwork);
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
    return {
      rpcUrl: {
        required: true,
        error: errors.rpcUrl,
        canReset: true,
        resetAction: rpcUrlResetAction,
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
  };
};
