import { useHistory } from 'react-router-dom';
import { useNetworkContext } from '@core/ui';
import { Network, NetworkFormErrors } from '@core/types';
import { NetworkFormTab } from './NetworkForm/types';
import { NetworkEditor } from './NetworkForm/NetworkEditor';

type AddNetworkProps = {
  setTab: (tab: NetworkFormTab) => void;
  setNetwork: (network: Network) => void;
  network: Network;
  isValid: boolean;
  reset: () => void;
  errors: NetworkFormErrors;
};

export const AddNetwork = ({
  setTab,
  setNetwork,
  network,
  isValid,
  reset,
  errors,
}: AddNetworkProps) => {
  const history = useHistory();
  const { saveCustomNetwork } = useNetworkContext();

  const submit = () => {
    console.log('submitting');
    saveCustomNetwork(network);
    history.goBack();
  };
  const cancel = () => {
    reset();
    history.goBack();
  };

  return (
    <NetworkEditor
      network={network}
      setNetwork={setNetwork}
      setTab={setTab}
      submit={submit}
      cancel={cancel}
      isValid={isValid}
      errors={errors}
    />
  );
};
