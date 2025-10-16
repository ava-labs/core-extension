import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CustomRpcHeadersManager } from './NetworkForm/CustomRpcHeadersManager';
import { RpcUrlResetConfirmation } from './Confirmations/RpcUrlResetConfirmation';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { NetworkUpdateConfirmation } from './Confirmations/NetworkUpdateConfirmation';
import { EditNetworkFormView } from './NetworkForm/types';
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

  const [view, setView] = useState<EditNetworkFormView>('details');

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
      setView('rpc-url-reset');
    },
  });

  const resetRpcUrlHandler = async () => {
    try {
      await resetRpcUrl();
      toast.success(t('RPC URL reset successfully'));
      setView('details');
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to reset RPC URL'));
    }
  };

  const saveHandler = async () => {
    try {
      await submit();
      toast.success(t('Network updated'));
      setView('details');
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
      setView('details');
    }
  };

  if (!network) {
    return <NetworkNotFound />;
  }

  switch (view) {
    case 'details':
      return (
        <NetworkDetails
          network={network}
          setNetwork={setNetwork}
          setView={setView}
          onSubmit={() => setView('save')}
          onCancel={reset}
          isValid={isValid}
          fieldInfo={fieldInfo}
          canResetRpcUrl={!isCustom}
          autoFocus={false}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={() => setView('delete')}
          isCustom={isCustom}
          pageType={'edit'}
        />
      );
    case 'rpc-headers':
      return (
        <CustomRpcHeadersManager
          network={network}
          setView={setView}
          setNetwork={setNetwork}
          readonly={!isEditing}
        />
      );
    case 'rpc-url-reset':
      return (
        <RpcUrlResetConfirmation
          onBack={() => setView('details')}
          onSubmit={resetRpcUrlHandler}
        />
      );
    case 'save':
      return (
        <NetworkUpdateConfirmation
          onBack={() => setView('details')}
          onSubmit={saveHandler}
        />
      );
    case 'delete':
      return (
        <NetworkDeleteConfirmation
          onBack={() => setView('details')}
          onSubmit={deleteHandler}
        />
      );
    default:
      return null;
  }
};
