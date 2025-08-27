import { AdvancedNetworkConfig, Network } from '@core/types';
import { useEditNetwork } from '../hooks/useEditNetwork';
import { NetworkFormTab } from './NetworkForm/types';
import { NetworkEditor } from './NetworkForm/NetworkEditor';
import { useHistory } from 'react-router-dom';
import { useNetworkContext } from '@core/ui';

type EditNetworkProps = {
  selectedNetwork: Network & AdvancedNetworkConfig;
  setTab: (tab: NetworkFormTab) => void;
};

export const EditNetwork = ({ selectedNetwork, setTab }: EditNetworkProps) => {
  const history = useHistory();
  const { network, isValid, errors, setNetwork, reset } = useEditNetwork({
    selectedNetwork,
  });
  const { updateDefaultNetwork } = useNetworkContext();

  const submit = () => {
    console.log('submitting');
    updateDefaultNetwork(network);
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
