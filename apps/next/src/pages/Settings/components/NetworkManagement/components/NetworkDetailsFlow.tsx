import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CustomRpcHeadersManager } from './NetworkForm/CustomRpcHeadersManager';
import { RpcUrlResetConfirmation } from './Confirmations/RpcUrlResetConfirmation';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { NetworkUpdateConfirmation } from './Confirmations/NetworkUpdateConfirmation';
import { EditNetworkFormTab } from './NetworkForm/types';
import { NetworkDetails } from './NetworkDetails';
import { NetworkDeleteConfirmation } from './Confirmations/NetworkDeleteConfirmation';
import { NetworkNotFound } from './NetworkNotFound';
import { useEditNetwork } from '../hooks/useEditNetwork';

type NetworkDetailsParams = {
  networkId: string;
};

export const NetworkDetailsFlow = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { networkId } = useParams<NetworkDetailsParams>();

  const [tab, setTab] = useState<EditNetworkFormTab>('details');

  const {
    network,
    isValid,
    isEditing,
    setIsEditing,
    isCustom,
    removeCustomNetwork,
    fieldInfo,
    setNetwork,
    reset,
    resetRpcUrl,
    submit,
  } = useEditNetwork({
    networkId: Number(networkId),
    rpcUrlResetButtonAction: () => {
      setTab('rpc-url-reset');
    },
  });

  const resetRpcUrlHandler = async () => {
    try {
      await resetRpcUrl();
      toast.success(t('RPC URL reset successfully'));
      setTab('details');
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to reset RPC URL'));
    }
  };

  const saveHandler = async () => {
    try {
      await submit();
      toast.success(t('Network updated'));
      setTab('details');
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to save network'));
    }
  };

  const deleteHandler = async () => {
    try {
      await removeCustomNetwork(Number(networkId));
      toast.success(t('Network deleted'));
      history.goBack();
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to delete network'));
      setTab('details');
    }
  };

  return !network ? (
    <NetworkNotFound />
  ) : tab === 'details' ? (
    <NetworkDetails
      network={network}
      setNetwork={setNetwork}
      setTab={setTab}
      onSubmit={() => setTab('save')}
      onCancel={reset}
      isValid={isValid}
      fieldInfo={fieldInfo}
      canResetRpcUrl={!isCustom}
      autoFocus={false}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onDelete={() => setTab('delete')}
      isCustom={isCustom}
      pageType={'edit'}
    />
  ) : tab === 'rpc-headers' ? (
    <CustomRpcHeadersManager
      network={network}
      setTab={setTab}
      setNetwork={setNetwork}
      readonly={!isEditing}
    />
  ) : tab === 'rpc-url-reset' ? (
    <RpcUrlResetConfirmation
      onBack={() => setTab('details')}
      onSubmit={resetRpcUrlHandler}
    />
  ) : tab === 'save' ? (
    <NetworkUpdateConfirmation
      onBack={() => setTab('details')}
      onSubmit={saveHandler}
    />
  ) : tab === 'delete' ? (
    <NetworkDeleteConfirmation
      onBack={() => setTab('details')}
      onSubmit={deleteHandler}
    />
  ) : null;
};
