import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomRpcHeadersManager } from './CustomRpcHeadersManager';
import { NetworkEditor } from './NetworkForm/NetworkEditor';
import { useEditNetwork } from '../hooks/useEditNetwork';
import { RpcUrlResetConfirmation } from './RpcUrlResetConfirmation';
import { NetworkNotFound } from './NetworkNotFound';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { NetworkUpdateConfirmation } from './NetworkUpdateConfirmation';
import { EditNetworkFormTab } from './NetworkForm/types';

type NetworkDetailsParams = {
  networkId: string;
};

export const NetworkDetailsFlow = () => {
  const { t } = useTranslation();
  const { networkId } = useParams<NetworkDetailsParams>();

  const [tab, setTab] = useState<EditNetworkFormTab>('details');

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
    networkId: Number(networkId),
    rpcUrlResetButtonAction: () => {
      console.log('rpcUrlResetAction');
      setTab('rpc-url-reset');
    },
  });

  useEffect(() => {
    console.log({ network });
  }, [network]);

  const resetRpcUrlHandler = () => {
    try {
      resetRpcUrl();
      toast.success(t('RPC URL reset successfully'));
      setTab('details');
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to reset RPC URL'));
    }
  };

  const saveHandler = () => {
    try {
      submit();
      toast.success(t('Network updated'));
      setTab('details');
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to save network'));
    }
  };

  return !network ? (
    <NetworkNotFound />
  ) : tab === 'details' ? (
    <NetworkEditor
      network={network}
      setNetwork={setNetwork}
      setTab={setTab}
      submit={() => setTab('save')}
      cancel={reset}
      isValid={isValid}
      fieldInfo={fieldInfo}
      canResetRpcUrl={!isCustom}
      autoFocus={false}
    />
  ) : tab === 'rpc-headers' ? (
    <CustomRpcHeadersManager
      network={network}
      setTab={setTab}
      setNetwork={setNetwork}
    />
  ) : tab === 'rpc-url-reset' ? (
    <RpcUrlResetConfirmation
      onBack={() => setTab('details')}
      onSubmit={resetRpcUrlHandler}
    />
  ) : (
    <NetworkUpdateConfirmation
      onBack={() => setTab('details')}
      onSubmit={saveHandler}
    />
  );
};
