import { isNetworkValid } from '@core/common';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useState } from 'react';

type UseEditNetworkProps = {
  selectedNetwork: Network & AdvancedNetworkConfig;
};

export const useEditNetwork = ({ selectedNetwork }: UseEditNetworkProps) => {
  const original = { ...selectedNetwork };
  const [network, setNetwork] = useState<Network & AdvancedNetworkConfig>(
    selectedNetwork,
  );

  const { valid: isValid } = isNetworkValid(network);

  const reset = () => {
    setNetwork(original);
  };
  const submit = () => {
    console.log('submit', network);
  };

  return { network, isValid, setNetwork, reset, submit };
};
