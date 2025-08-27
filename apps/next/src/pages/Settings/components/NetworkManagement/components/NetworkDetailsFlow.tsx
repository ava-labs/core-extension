import { useNetworkContext } from '@core/ui';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NetworkFormTab } from './NetworkForm/types';
import { EditNetwork } from './EditNetwork';

type NetworkDetailsParams = {
  networkId: string;
};

export const NetworkDetailsFlow = () => {
  const { networkId } = useParams<NetworkDetailsParams>();
  const { networks } = useNetworkContext();

  const [tab, setTab] = useState<NetworkFormTab>('details');

  const network = useMemo(() => {
    return networks.find((n) => n.chainId === Number(networkId));
  }, [networks, networkId]);

  return (
    <>
      {tab === 'details' ? (
        network ? (
          <EditNetwork selectedNetwork={network} setTab={setTab} />
        ) : (
          <div>Network not found</div>
        )
      ) : (
        network && <EditNetwork selectedNetwork={network} setTab={setTab} />
      )}
    </>
  );
};
