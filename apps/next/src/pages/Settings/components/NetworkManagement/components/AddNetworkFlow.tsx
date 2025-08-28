import { useAddNetwork } from '../hooks/useAddNetwork';
import { useEffect, useState } from 'react';
import { CustomRpcHeadersManager } from './CustomRpcHeadersManager';
import { AddNetwork } from './AddNetwork';
import { NetworkFormTab } from './NetworkForm/types';

export const AddNetworkFlow = () => {
  const { network, setNetwork, reset, isValid, errors } = useAddNetwork();
  const [ranReset, setRanReset] = useState<boolean>(false);

  const [tab, setTab] = useState<NetworkFormTab>('details');

  useEffect(() => {
    console.log('isValid', isValid);
    console.log('errors', errors);
  }, [isValid, errors]);
  useEffect(() => {
    if (!ranReset) {
      console.log('resetting');
      reset();
      setRanReset(true);
    }
  }, [reset, ranReset]);

  return (
    <>
      {tab === 'details' && (
        <AddNetwork
          setNetwork={setNetwork}
          network={network}
          isValid={isValid}
          setTab={setTab}
          reset={reset}
          errors={errors}
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
