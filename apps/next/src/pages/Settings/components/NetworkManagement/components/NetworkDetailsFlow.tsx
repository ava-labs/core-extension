import { useNetworkContext } from '@core/ui';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NetworkFormTab } from './NetworkForm/types';
import { CustomRpcHeadersManager } from './CustomRpcHeadersManager';
import { NetworkEditor } from './NetworkForm/NetworkEditor';
import { useEditNetwork } from '../hooks/useEditNetwork';
import { RpcUrlResetConfirmation } from './RpcUrlResetConfirmation';

type NetworkDetailsParams = {
  networkId: string;
};

export const NetworkDetailsFlow = () => {
  const { networkId } = useParams<NetworkDetailsParams>();
  const { networks } = useNetworkContext();

  const [tab, setTab] = useState<NetworkFormTab>('details');

  const selectedNetwork = useMemo(() => {
    return networks.find((n) => n.chainId === Number(networkId));
  }, [networks, networkId]);

  const {
    network,
    isValid,
    isCustom,
    fieldInfo,
    setNetwork,
    reset,
    resetRpcUrl,
    submit,
  } = useEditNetwork({
    selectedNetwork,
    rpcUrlResetAction: () => {
      console.log('rpcUrlResetAction');
      setTab('rpc-url-reset');
    },
  });

  return !network ? (
    <div>Network not found</div>
  ) : tab === 'details' ? (
    <NetworkEditor
      network={network}
      setNetwork={setNetwork}
      setTab={setTab}
      submit={submit}
      cancel={reset}
      isValid={isValid}
      fieldInfo={fieldInfo}
      canResetRpcUrl={!isCustom}
    />
  ) : tab === 'rpc-headers' ? (
    <CustomRpcHeadersManager
      network={network}
      setTab={setTab}
      setNetwork={setNetwork}
    />
  ) : (
    <RpcUrlResetConfirmation
      onBack={() => setTab('details')}
      onSubmit={resetRpcUrl}
    />
  );
};
