import { useAddNetwork } from '../hooks/useAddNetwork';
import { useEffect, useState } from 'react';
import { CustomRpcHeadersManager } from './CustomRpcHeadersManager';
import { NetworkFormTab } from './NetworkForm/types';
import { useHistory } from 'react-router-dom';
import { NetworkEditor } from './NetworkForm/NetworkEditor';

export const AddNetworkFlow = () => {
  const history = useHistory();
  const { network, setNetwork, reset, isValid, submit, fieldInfo } =
    useAddNetwork();
  const [ranReset, setRanReset] = useState<boolean>(false);

  const [tab, setTab] = useState<NetworkFormTab>('details');

  useEffect(() => {
    if (!ranReset) {
      console.log('resetting');
      reset();
      setRanReset(true);
    }
  }, [reset, ranReset]);

  const submitHandler = () => {
    submit();
    history.goBack();
  };

  const cancel = () => {
    reset();
    history.goBack();
  };

  return (
    <>
      {tab === 'details' && (
        <NetworkEditor
          network={network}
          setNetwork={setNetwork}
          setTab={setTab}
          submit={submitHandler}
          cancel={cancel}
          isValid={isValid}
          fieldInfo={fieldInfo}
          canResetRpcUrl={false}
        />
      )}
      {tab === 'rpc-headers' && (
        <CustomRpcHeadersManager
          setTab={setTab}
          setNetwork={setNetwork}
          network={network}
        />
      )}
    </>
  );
};
