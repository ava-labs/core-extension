import { useState } from 'react';
import { CustomRpcHeadersManager } from './NetworkForm/CustomRpcHeadersManager';
import { useHistory } from 'react-router-dom';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { AddNetworkFormTab } from './NetworkForm/types';
import { NetworkDetails } from './NetworkDetails';
import { useAddNetwork } from '../hooks/useAddNetworks';

export const AddNetworkFlow = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { network, setNetwork, reset, isValid, submit, fieldInfo } =
    useAddNetwork();

  const [tab, setTab] = useState<AddNetworkFormTab>('details');

  const goBackToNetworks = () => {
    reset();
    history.replace('/settings/networks');
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
      {tab === 'details' && (
        <NetworkDetails
          network={network}
          setNetwork={setNetwork}
          setTab={(newTab) => {
            if (newTab === 'details' || newTab === 'rpc-headers') {
              setTab(newTab);
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
      {tab === 'rpc-headers' && (
        <CustomRpcHeadersManager
          setTab={(newTab) => {
            if (newTab === 'details' || newTab === 'rpc-headers') {
              setTab(newTab);
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
