import { useAddNetwork } from '../hooks/useAddNetwork';
import { useEffect, useState } from 'react';
import { CustomRpcHeadersManager } from './CustomRpcHeadersManager';
import { AddNetwork } from './AddNetwork';
import { NetworkFormTab } from './NetworkForm/types';

export const AddNetworkFlow = () => {
  const { network, setNetwork, reset, isValid } = useAddNetwork();
  const [ranReset, setRanReset] = useState<boolean>(false);

  const [tab, setTab] = useState<NetworkFormTab>('details');

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
