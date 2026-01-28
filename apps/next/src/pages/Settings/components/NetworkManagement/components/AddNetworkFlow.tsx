import { useState } from 'react';
import { CustomRpcHeadersManager } from './NetworkForm/CustomRpcHeadersManager';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { AddNetworkFormView } from './NetworkForm/types';
import { NetworkDetails } from './NetworkDetails';
import { useAddNetwork } from '../hooks/useAddNetwork';
import { useNavigation } from '@core/ui';

export const AddNetworkFlow = () => {
  const { goBack } = useNavigation('slide');
  const { t } = useTranslation();
  const { network, setNetwork, reset, isValid, submit, fieldInfo } =
    useAddNetwork();

  const [view, setView] = useState<AddNetworkFormView>('details');

  const goBackToNetworks = () => {
    reset();
    goBack();
  };

  const submitHandler = async () => {
    try {
      await submit();
      toast.success(t('Network added'));
      goBackToNetworks();
    } catch (error) {
      console.error(error);
      toast.error(t('Failed to add network'));
    }
  };

  const cancel = () => {
    goBackToNetworks();
  };

  return (
    <>
      {view === 'details' && (
        <NetworkDetails
          network={network}
          setNetwork={setNetwork}
          setView={(newView) => {
            if (newView === 'details' || newView === 'rpc-headers') {
              setView(newView);
            }
          }}
          onSubmit={submitHandler}
          onCancel={cancel}
          isValid={isValid}
          fieldInfo={fieldInfo}
          canResetRpcUrl={false}
          autoFocus={true}
          isEditing={true}
          setIsEditing={() => {}}
          onDelete={() => {}}
          isCustom={true}
          pageType={'add'}
        />
      )}
      {view === 'rpc-headers' && (
        <CustomRpcHeadersManager
          setView={(newView) => {
            if (newView === 'details' || newView === 'rpc-headers') {
              setView(newView);
            }
          }}
          setNetwork={setNetwork}
          network={network}
          readonly={false}
        />
      )}
    </>
  );
};
