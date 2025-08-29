import { useAddNetwork } from '../hooks/useAddNetwork';
import { useState } from 'react';
import { CustomRpcHeadersManager } from './CustomRpcHeadersManager';
import { useHistory } from 'react-router-dom';
import { NetworkEditor } from './NetworkForm/NetworkEditor';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { AddNetworkFormTab } from './NetworkForm/types';

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

  const submitHandler = () => {
    try {
      submit();
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
        <NetworkEditor
          network={network}
          setNetwork={setNetwork}
          setTab={(newTab) => {
            if (newTab === 'details' || newTab === 'rpc-headers') {
              setTab(newTab);
            }
          }}
          submit={submitHandler}
          cancel={cancel}
          isValid={isValid}
          fieldInfo={fieldInfo}
          canResetRpcUrl={false}
          autoFocus={true}
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
        />
      )}
    </>
  );
};
