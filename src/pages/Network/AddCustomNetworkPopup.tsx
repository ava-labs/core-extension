import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { ActionStatus } from '@src/background/services/actions/models';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useCallback, useEffect, useState } from 'react';
import { useApproveAction } from '../../hooks/useApproveAction';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertContent,
  AlertTitle,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  GlobeIcon,
  Stack,
  TextField,
  Typography,
} from '@avalabs/k2-components';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { buildGlacierAuthHeaders } from '@src/background/services/network/utils/buildGlacierAuthHeaders';
import { useKeyboardShortcuts } from '@src/hooks/useKeyboardShortcuts';
import { AddEthereumChainDisplayData } from '@src/background/services/network/models';

export function AddCustomNetworkPopup() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } =
    useApproveAction<AddEthereumChainDisplayData>(requestId);

  const [apiKey, setApiKey] = useState('');
  const [isApiModalVisible, setIsApiModalVisible] = useState(false);
  const [isSavingApiKey, setIsSavingApiKey] = useState(false);

  const handleApproval = useCallback(
    async () =>
      updateAction({
        status: ActionStatus.SUBMITTING,
        id: requestId,
      }),
    [requestId, updateAction]
  );

  const saveApiKey = useCallback(async () => {
    if (isSavingApiKey) {
      return;
    }

    if (!action || !action.displayData) {
      throw new Error('Network config not available');
    }

    if (!apiKey) {
      throw new Error('API Key was not provided');
    }

    setIsSavingApiKey(true);

    try {
      await updateAction({
        status: ActionStatus.PENDING,
        id: requestId,
        displayData: {
          ...action.displayData,
          network: {
            ...action.displayData.network,
            customRpcHeaders: buildGlacierAuthHeaders(apiKey),
          },
        },
      });
    } finally {
      setIsSavingApiKey(false);
    }

    await handleApproval();
  }, [apiKey, action, requestId, updateAction, handleApproval, isSavingApiKey]);

  const shouldPromptForApiKey =
    action?.displayData.options.requiresGlacierApiKey && !apiKey;

  useEffect(() => {
    window.addEventListener('unload', cancelHandler);

    return () => {
      window.removeEventListener('unload', cancelHandler);
    };
  }, [cancelHandler]);

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: saveApiKey,
    Esc: () => setIsApiModalVisible(false),
  });

  if (!action || !action.displayData) {
    return (
      <Stack
        sx={{
          width: 1,
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  const customNetwork = action.displayData.network;

  return (
    <>
      <Stack sx={{ flexGrow: 1, width: 1, px: 2, py: 1 }}>
        <Typography
          component="h1"
          sx={{ mt: 1, mb: 3, fontSize: 24, fontWeight: 'bold' }}
        >
          {t('Add New Network?')}
        </Typography>
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <SiteAvatar sx={{ mb: 2 }}>
            <TokenIcon height="48px" width="48px" src={customNetwork?.logoUri}>
              <GlobeIcon size={48} />
            </TokenIcon>
          </SiteAvatar>

          <Typography variant="h5">{customNetwork.chainName}</Typography>
          <Typography
            sx={{
              textAlign: 'center',
              maxWidth: 1,
              wordWrap: 'break-word',
              color: 'text.secondary',
            }}
            variant="caption"
          >
            {action?.site?.domain}
          </Typography>
        </Stack>

        {action.displayData.options.requiresGlacierApiKey && (
          <Alert color="info" sx={{ mb: 2 }}>
            <AlertTitle>{t('Glacier API key is required')}</AlertTitle>
            <AlertContent>
              {t(
                'In order for this network to be fully functional, you need to provide your Glacier API key. You will be prompted to do so upon approval.'
              )}
            </AlertContent>
          </Alert>
        )}

        <Card sx={{ flexGrow: 1 }}>
          <Scrollbars>
            <Stack sx={{ p: 2 }}>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Chain ID')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.chainId}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Chain Name')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.chainName}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('RPC URL')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.rpcUrl}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Explorer URL')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.explorerUrl}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Network Symbol')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.networkToken.symbol}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Token Name')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.networkToken.name}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Token Decimals')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.networkToken.decimals}
                </Typography>
              </Stack>
            </Stack>
          </Scrollbars>
        </Card>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '100%',
            justifyContent: 'space-between',
            pt: 3,
            gap: 1,
          }}
        >
          <Button
            color="secondary"
            data-testid="transaction-reject-btn"
            size="large"
            fullWidth
            disabled={action.status === ActionStatus.SUBMITTING}
            onClick={() => {
              cancelHandler();
              window.close();
            }}
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="transaction-approve-btn"
            size="large"
            fullWidth
            disabled={
              action.status === ActionStatus.SUBMITTING || !!action.error
            }
            onClick={() => {
              if (shouldPromptForApiKey) {
                setIsApiModalVisible(true);
              } else {
                handleApproval();
              }
            }}
          >
            {t('Approve')}
          </Button>
        </Stack>
      </Stack>
      <Dialog
        open={isApiModalVisible}
        PaperProps={{ sx: { mx: 2 } }}
        onClose={() => setIsApiModalVisible(false)}
        showCloseIcon
      >
        <DialogTitle>{t('Provide API Key')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {t(
              'This network requires additional authentication to be fully functional.'
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t(
              'The API key can also be configured in the network settings later on.'
            )}
          </Typography>
          <TextField
            type="password"
            placeholder={t('Glacier API Key')}
            sx={{ mt: 2 }}
            onChange={(ev) => setApiKey(ev.target.value)}
            {...keyboardShortcuts}
          />
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <Button
            key="save"
            size="large"
            data-testid="api-key-save"
            disabled={
              action.status === ActionStatus.SUBMITTING ||
              !!action.error ||
              !apiKey ||
              isSavingApiKey
            }
            isLoading={
              isSavingApiKey || action.status === ActionStatus.SUBMITTING
            }
            onClick={saveApiKey}
          >
            {t('Save')}
          </Button>
          <Button
            key="skip"
            variant="text"
            data-testid="api-key-skip"
            disabled={
              isSavingApiKey ||
              action.status === ActionStatus.SUBMITTING ||
              !!action.error
            }
            onClick={() => handleApproval()}
          >
            {t('I will configure it later')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
