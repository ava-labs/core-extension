import { Network } from '@avalabs/chains-sdk';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Scrollbars,
  ScrollbarsRef,
  Stack,
  Typography,
  toast,
} from '@avalabs/k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

import {
  NetworkForm,
  NetworkFormAction,
  NetworkFormActions,
} from './NetworkForm';
import {
  NetworkDetailsDialogOptions,
  NetworkDetailsDialogs,
} from './NetworkDetailsDialogs';

export const EditNetwork = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { networkId } = useParams<{ networkId: string }>();
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
      (networkItem) => networkItem.chainId === selectedChainId
    );

    setNetworkState(networkData);
  }, [networks, setNetworkState, selectedChainId]);

  if (!networkState) {
    return null;
  }

  const goBack = () => {
    history.length <= 2
      ? history.replace(`/networks/details/${networkId}`)
      : history.goBack();
  };
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
  const onUpdateURLSuccess = () => {
    capture('DefaultNetworkRPCEdited');
    toast.success(t('RPC URL Updated!'), { duration: 2000 });
    setErrorMessage('');
  };
  const onResetURLSuccess = () => {
    capture('DefaultNetworkRPCReset');
    toast.success(t('RPC URL Reset!'), { duration: 2000 });
    setErrorMessage('');
  };

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

  const resetRpcUrl = () => {
    //  We're resetting the RPC url, so we want to send it as undefined to the backend.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  };

  const hideDialogs = () => {
    setIsResetRpcUrlDialog(false);
    setIsUpdateRpcUrlDialog(false);
  };

  const handleDialogPrimaryClick = (dialog: NetworkDetailsDialogOptions) => {
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
  };

  const onUpdateRpcUrl = () => {
    setIsUpdateRpcUrlDialog(true);
  };

  const handleResetUrl = () => {
    setIsResetRpcUrlDialog(true);
  };

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
