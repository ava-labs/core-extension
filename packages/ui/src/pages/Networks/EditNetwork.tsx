import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Scrollbars,
  ScrollbarsRef,
  Stack,
  Typography,
  toast,
} from '@avalabs/core-k2-components';

import { PageTitle } from '@/components/common/PageTitle';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import {
  CustomRpcHeaders,
  Network,
} from '@core/types';

import {
  NetworkForm,
  NetworkFormAction,
  NetworkFormActions,
} from './NetworkForm';
import {
  NetworkDetailsDialogOptions,
  NetworkDetailsDialogs,
} from './NetworkDetailsDialogs';
import { useGoBack } from '@/hooks/useGoBack';

export const EditNetwork = () => {
  const { t } = useTranslation();
  const { networkId } = useParams<{ networkId: string }>();
  const goBack = useGoBack(`/networks/details/${networkId}`);
  const selectedChainId = parseInt(networkId, 10);
  const { networks, isCustomNetwork, saveCustomNetwork, updateDefaultNetwork } =
    useNetworkContext();
  const [isFormValid, setIsFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollbarRef = useRef<ScrollbarsRef | null>(null);
  const { capture } = useAnalyticsContext();

  const childRef = useRef<NetworkFormActions>(null);
  const [networkState, setNetworkState] = useState<Network>();
  const [isResetRpcUrlDialog, setIsResetRpcUrlDialog] = useState(false);
  const [isUpdateRpcUrlDialog, setIsUpdateRpcUrlDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const networkData = networks.find(
      (networkItem) => networkItem.chainId === selectedChainId,
    );

    setNetworkState(networkData);
  }, [networks, setNetworkState, selectedChainId]);

  const isCustom = networkState && isCustomNetwork(networkState.chainId);

  const handleChange = (newNetworkState: Network, isValid: boolean) => {
    setIsFormValid(isValid);
    setNetworkState({
      ...newNetworkState,
    });
  };

  const onEditSuccess = () => {
    capture('CustomNetworkEdited');
    toast.success(t('Custom Network Edited!'), { duration: 2000 });
    setErrorMessage('');
    goBack();
  };
  const onUpdateURLSuccess = useCallback(() => {
    capture('DefaultNetworkRPCEdited');
    toast.success(t('RPC URL Updated!'), { duration: 2000 });
    setErrorMessage('');
  }, [capture, t]);

  const onResetURLSuccess = useCallback(() => {
    capture('DefaultNetworkRPCReset');
    toast.success(t('RPC URL Reset!'), { duration: 2000 });
    setErrorMessage('');
  }, [capture, t]);

  const handleEdit = () => {
    if (!isCustom) {
      onUpdateRpcUrl();
    } else {
      setIsSaving(true);
      saveCustomNetwork(networkState)
        .then(() => {
          onEditSuccess();
        })
        .catch(onError)
        .finally(() => {
          setIsSaving(false);
        });
    }
  };

  const onError = (e: string) => {
    setErrorMessage(e);
    scrollbarRef?.current?.scrollToTop();
  };

  const resetRpcUrl = useCallback(() => {
    if (!networkState) {
      return;
    }
    //  We're resetting the RPC url, so we want to send it as undefined to the backend.

    const { rpcUrl, ...networkWithoutRpcUrl } = networkState;

    updateDefaultNetwork(networkWithoutRpcUrl)
      .then(() => {
        goBack();
        onResetURLSuccess();
      })
      .catch((e) => {
        hideDialogs();
        onError(e);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [goBack, networkState, onResetURLSuccess, updateDefaultNetwork]);

  const updateHeaders = useCallback(
    (headers: CustomRpcHeaders) => {
      if (!networkState) {
        return;
      }

      setIsSaving(true);

      updateDefaultNetwork({
        ...networkState,
        customRpcHeaders: headers,
      })
        .then(() => {
          goBack();
          toast.success(t('RPC Headers Updated'), { duration: 2000 });
          setErrorMessage('');
        })
        .catch(onError)
        .finally(() => {
          setIsSaving(false);
        });
    },
    [goBack, networkState, t, updateDefaultNetwork],
  );

  const hideDialogs = () => {
    setIsResetRpcUrlDialog(false);
    setIsUpdateRpcUrlDialog(false);
  };

  const handleDialogPrimaryClick = useCallback(
    (dialog: NetworkDetailsDialogOptions) => {
      if (!networkState) {
        return;
      }

      setIsSaving(true);
      switch (dialog) {
        case NetworkDetailsDialogOptions.RESET_RPC_URL_DIALOG:
          resetRpcUrl();
          break;
        case NetworkDetailsDialogOptions.UPDATE_RPC_URL_DIALOG:
          updateDefaultNetwork(networkState)
            .then(() => {
              goBack();
              onUpdateURLSuccess();
            })
            .catch((e) => {
              hideDialogs();
              onError(e);
            });
          break;
        default:
          return null;
      }
    },
    [
      goBack,
      networkState,
      onUpdateURLSuccess,
      resetRpcUrl,
      updateDefaultNetwork,
    ],
  );

  const onUpdateRpcUrl = () => {
    setIsUpdateRpcUrlDialog(true);
  };

  const handleResetUrl = () => {
    setIsResetRpcUrlDialog(true);
  };

  if (!networkState) {
    return null;
  }

  return (
    <Stack sx={{ width: 1 }}>
      <PageTitle>{t('Edit Network')}</PageTitle>

      <Stack sx={{ px: 2, flexGrow: 1 }}>
        <Scrollbars ref={scrollbarRef}>
          <Stack sx={{ width: 1, gap: 3, mt: 1, alignItems: 'center' }}>
            {errorMessage && (
              <Typography variant="body2" color="error.main">
                {errorMessage}
              </Typography>
            )}
            {networkState && (
              <NetworkForm
                customNetwork={networkState}
                handleChange={handleChange}
                handleRpcHeadersChange={updateHeaders}
                action={NetworkFormAction.Edit}
                isCustomNetwork={isCustom}
                handleResetUrl={handleResetUrl}
                ref={childRef}
              />
            )}
          </Stack>
        </Scrollbars>
      </Stack>

      <Stack
        direction="row"
        sx={{ px: 2, py: 3, alignItems: 'center', gap: 1 }}
      >
        <Button fullWidth size="large" color="secondary" onClick={goBack}>
          {t('Cancel')}
        </Button>
        <Button
          fullWidth
          size="large"
          onClick={handleEdit}
          disabled={!isFormValid || isSaving}
          isLoading={isSaving}
        >
          {t('Save')}
        </Button>
      </Stack>
      <NetworkDetailsDialogs
        isPrimaryButtonLoading={isSaving}
        isResetRpcUrl={isResetRpcUrlDialog}
        isUpdateRpcUrl={isUpdateRpcUrlDialog}
        handlePrimaryClick={handleDialogPrimaryClick}
        hideDialog={() => hideDialogs()}
      />
    </Stack>
  );
};
