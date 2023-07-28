import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  AlertContent,
  AlertTitle,
  Button,
  Card,
  CircularProgress,
  GlobeIcon,
  InfoCircleIcon,
  Scrollbars,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/k2-components';

import Dialog from '@src/components/common/Dialog';
import { ActionStatus } from '@src/background/services/actions/models';
import { MessageType } from '@src/background/services/messages/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { TokenIconK2 } from '@src/components/common/TokenImageK2';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useApproveAction } from '@src/hooks/useApproveAction';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';

import { EthSign } from './components/EthSign';
import { PersonalSign } from './components/PersonalSign';
import { SignData } from './components/SignData';
import { SignDataV3 } from './components/SignDataV3';
import { SignDataV4 } from './components/SignDataV4';
import { SignTxErrorBoundary } from '../SignTransaction/components/SignTxErrorBoundary';

export function SignMessage() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const { action, updateAction: updateMessage } = useApproveAction(requestId);

  // TODO: remove this in https://ava-labs.atlassian.net/browse/CP-5617
  // Message signing is not currently supported by the Ledger Avalanche app
  // We also disable the "Sign" button
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const [showNotSupportedDialog, setShowNotSupportedDialog] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [messageAlertClosed, setMessageAlertClosed] = useState(false);

  function scrollFrameHandler(values: { top: number }) {
    // if values.top is 1, that means the user has scrolled to the bottom
    if (values.top === 1) {
      setDisableSubmitButton(false);
    }
  }

  function updateHandler(values: {
    scrollHeight: number;
    clientHeight: number;
  }) {
    // when these 2 values are the same, the content fit in the view without scroller
    if (values.scrollHeight === values.clientHeight) {
      setDisableSubmitButton(false);
    }
  }

  useEffect(() => {
    if (isUsingLedgerWallet && action) {
      setShowNotSupportedDialog(true);
    }
  }, [isUsingLedgerWallet, action]);

  const notSupportedDialog = (
    <Stack sx={{ justifyContent: 'center', width: '100%' }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        {t('Not Supported')}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
        {t('Message signing not supported by the Avalanche Ledger app')}
      </Typography>
      <Stack
        sx={{
          mt: 3,
        }}
      >
        <Button
          sx={{ mb: 1 }}
          onClick={() => {
            updateMessage({
              status: ActionStatus.ERROR_USER_CANCELED,
              id: action?.id,
            });
            window.close();
          }}
        >
          {t('Close')}
        </Button>
      </Stack>
    </Stack>
  );

  if (!action) {
    return (
      <Stack
        direction="row"
        sx={{
          width: 1,
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Stack>
    );
  }

  return (
    <>
      <Stack sx={{ px: 2, width: 1 }}>
        <SignTxErrorBoundary variant="RenderError">
          {!action.displayData.isMessageValid && !messageAlertClosed ? (
            <Stack
              sx={{
                backgroundColor: 'common.black',
                px: 2,
                pt: 2,
                width: 1,
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            >
              <Alert
                onClose={() => {
                  setMessageAlertClosed(true);
                }}
                severity="warning"
              >
                <AlertTitle>{t('Warning: Verify Message Content')}</AlertTitle>
                <Tooltip title={action.displayData.validationError ?? ''}>
                  <AlertContent sx={{ cursor: 'pointer' }}>
                    {t('This message contains non-standard elements.')}
                  </AlertContent>
                </Tooltip>
              </Alert>
            </Stack>
          ) : null}

          <Stack sx={{ py: 1.5 }}>
            <Typography variant="h3">
              {action.error ? t('Signing Failed') : t('Sign Message')}
            </Typography>
          </Stack>

          <Stack sx={{ alignItems: 'center', pt: 2, pb: 3 }}>
            <SiteAvatar justify="center" align="center">
              <TokenIconK2 height="48px" width="48px" src={action.site?.icon}>
                <GlobeIcon size={48} />
              </TokenIconK2>
            </SiteAvatar>
            <Typography variant="h5" sx={{ mt: 1 }}>
              {action.site?.name ?? t('Unknown')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <Trans
                i18nKey="{{domain}} requests you to <br />sign the following message"
                values={{ domain: action.site?.domain || 'A site' }}
              />
            </Typography>
          </Stack>

          {/* Actions  */}
          {
            {
              [MessageType.ETH_SIGN]: (
                <EthSign
                  message={action.displayData.messageParams}
                  scrollFrameHandler={scrollFrameHandler}
                  updateHandler={updateHandler}
                />
              ),
              [MessageType.PERSONAL_SIGN]: (
                <PersonalSign
                  message={action.displayData.messageParams}
                  scrollFrameHandler={scrollFrameHandler}
                  updateHandler={updateHandler}
                />
              ),
              [MessageType.SIGN_TYPED_DATA]: (
                <SignData
                  message={action.displayData.messageParams}
                  scrollFrameHandler={scrollFrameHandler}
                  updateHandler={updateHandler}
                />
              ),
              [MessageType.SIGN_TYPED_DATA_V1]: (
                <SignData
                  message={action.displayData.messageParams}
                  scrollFrameHandler={scrollFrameHandler}
                  updateHandler={updateHandler}
                />
              ),
              [MessageType.SIGN_TYPED_DATA_V3]: (
                <SignDataV3
                  message={action.displayData.messageParams}
                  scrollFrameHandler={scrollFrameHandler}
                  updateHandler={updateHandler}
                />
              ),
              [MessageType.SIGN_TYPED_DATA_V4]: (
                <SignDataV4
                  message={action.displayData.messageParams}
                  scrollFrameHandler={scrollFrameHandler}
                  updateHandler={updateHandler}
                />
              ),
              ['unknown']: (
                <Typography color="error.main" sx={{ my: 1 }}>
                  {t('Unknown sign type')}
                </Typography>
              ),
            }[action.method || 'unknown']
          }

          {action.error && (
            <Stack sx={{ mt: 2, width: 1 }}>
              <Typography variant="caption" color="error.main" sx={{ mb: 1 }}>
                {t('Error:')}
              </Typography>
              <Card sx={{ height: 105 }}>
                <Scrollbars
                  style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                >
                  <Stack sx={{ px: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {action.error}
                    </Typography>
                  </Stack>
                </Scrollbars>
              </Card>
            </Stack>
          )}

          {disableSubmitButton && (
            <Stack
              direction="row"
              sx={{
                my: 2,
                width: 1,
                columnGap: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <InfoCircleIcon size={14} />
              <Typography variant="overline">
                {t(
                  'Scroll to the bottom of the message to be able to continue'
                )}
              </Typography>
            </Stack>
          )}

          {/* Action Buttons */}
          <Stack
            direction="row"
            sx={{
              flexGrow: 1,
              alignItems: 'flex-end',
              width: 1,
              justifyContent: 'space-between',
              pb: 1,
              gap: 1,
            }}
          >
            <Button
              color="secondary"
              size="large"
              fullWidth
              onClick={() => {
                updateMessage({
                  status: ActionStatus.ERROR_USER_CANCELED,
                  id: action.id,
                });
                window.close();
              }}
            >
              {t('Reject')}
            </Button>
            <Button
              color="primary"
              size="large"
              disabled={isUsingLedgerWallet || disableSubmitButton}
              onClick={() => {
                updateMessage({
                  status: ActionStatus.SUBMITTING,
                  id: action.id,
                });
              }}
              fullWidth
            >
              {t('Sign')}
            </Button>
          </Stack>
        </SignTxErrorBoundary>
      </Stack>
      <Dialog
        onClose={() => window.close()}
        open={showNotSupportedDialog}
        content={notSupportedDialog}
        bgColorDefault
      />
    </>
  );
}
