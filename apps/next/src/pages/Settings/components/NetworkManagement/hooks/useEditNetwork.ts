import { isNetworkValid } from '../components/NetworkForm/utils/isNetworkValid';
import { AdvancedNetworkConfig, Network } from '@core/types';
import { useMemo, useState } from 'react';

type UseEditNetworkProps = {
  selectedNetwork: Network & AdvancedNetworkConfig;
};

export const useEditNetwork = ({ selectedNetwork }: UseEditNetworkProps) => {
  const original = { ...selectedNetwork };
  const [network, setNetwork] = useState<Network & AdvancedNetworkConfig>(
    selectedNetwork,
  );

  const { isValid, errors } = useMemo(() => isNetworkValid(network), [network]);

  const reset = () => {
    setNetwork(original);
  };
  const submit = () => {
    console.log('submit', network);
  };

  return { network, isValid, errors, setNetwork, reset, submit };
};
