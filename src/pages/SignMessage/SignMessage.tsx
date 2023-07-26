import {
  Card,
  ComponentSize,
  GlobeIcon,
  HorizontalFlex,
  InfoIcon,
  LoadingSpinnerIcon,
  PrimaryButton,
  SecondaryButton,
  VerticalFlex,
} from '@avalabs/react-components';
import { ActionStatus } from '@src/background/services/actions/models';
import { MessageType } from '@src/background/services/messages/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { TokenIcon } from '@src/components/common/TokenImage';
import Scrollbars, { positionValues } from 'react-custom-scrollbars-2';
import { useTheme } from 'styled-components';
import { useApproveAction } from '../../hooks/useApproveAction';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { SignTxErrorBoundary } from '../SignTransaction/components/SignTxErrorBoundary';
import { EthSign } from './components/EthSign';
import { PersonalSign } from './components/PersonalSign';
import { SignData } from './components/SignData';
import { SignDataV3 } from './components/SignDataV3';
import { SignDataV4 } from './components/SignDataV4';
import { Trans, useTranslation } from 'react-i18next';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { useEffect, useState } from 'react';
import {
  Alert,
  AlertContent,
  AlertTitle,
  Button,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/k2-components';
import Dialog from '@src/components/common/Dialog';

export function SignMessage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action, updateAction: updateMessage } = useApproveAction(requestId);

  // TODO: remove this in https://ava-labs.atlassian.net/browse/CP-5617
  // Message signing is not currently supported by the Ledger Avalanche app
  // We also disable the "Sign" button
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const [showNotSupportedDialog, setShowNotSupportedDialog] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [messageAlertClosed, setMessageAlertClosed] = useState(false);

  function scrollFrameHandler(values: positionValues) {
    // if values.top is 1, that means the user has scrolled to the bottom
    if (values.top === 1) {
      setDisableSubmitButton(false);
    }
  }

  function updateHandler(values: positionValues) {
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
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingSpinnerIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  return (
    <>
      <VerticalFlex width="100%" padding="0 16px">
        <SignTxErrorBoundary>
          {!action.displayData.isMessageValid && !messageAlertClosed ? (
            <VerticalFlex
              style={{ left: 0 }}
              position="absolute"
              padding="0 16px"
              background={theme.colors.bg1}
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
            </VerticalFlex>
          ) : null}

          <VerticalFlex padding="12px 0">
            <Typography variant="h3">
              {action.error ? t('Signing Failed') : t('Sign Message')}
            </Typography>
          </VerticalFlex>

          <VerticalFlex align="center" margin="16px 0 24px">
            <SiteAvatar justify="center" align="center">
              <TokenIcon height="48px" width="48px" src={action.site?.icon}>
                <GlobeIcon
                  height="48px"
                  width="48px"
                  color={theme.colors.icon1}
                />
              </TokenIcon>
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
          </VerticalFlex>

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
                <Typography color={theme.colors.error} size={14} margin="8px 0">
                  {t('Unknown sign type')}
                </Typography>
              ),
            }[action.method || 'unknown']
          }

          {action.error && (
            <VerticalFlex margin="16px 0 0 0" width={'100%'}>
              <Typography size={12} height="15px" margin="0 0 8px 0">
                {t('Error:')}
              </Typography>
              <Card height="105px" padding="16px 0">
                <Scrollbars
                  style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                >
                  <VerticalFlex padding="0 16px">
                    <Typography size={12} height="17px" wordBreak="break-all">
                      {action.error}
                    </Typography>
                  </VerticalFlex>
                </Scrollbars>
              </Card>
            </VerticalFlex>
          )}

          {disableSubmitButton && (
            <HorizontalFlex
              margin="16px 0 0 0"
              width={'100%'}
              columnGap="8px"
              justify="center"
              align="center"
            >
              <InfoIcon height="13px" color={theme.colors.text2} />
              <Typography variant="overline">
                {t(
                  'Scroll to the bottom of the message to be able to continue'
                )}
              </Typography>
            </HorizontalFlex>
          )}

          {/* Action Buttons */}
          <HorizontalFlex
            flex={1}
            align="flex-end"
            width="100%"
            justify="space-between"
            padding="0 0 8px"
          >
            <SecondaryButton
              size={ComponentSize.LARGE}
              width="168px"
              onClick={() => {
                updateMessage({
                  status: ActionStatus.ERROR_USER_CANCELED,
                  id: action.id,
                });
                window.close();
              }}
            >
              {t('Reject')}
            </SecondaryButton>
            <PrimaryButton
              width="168px"
              size={ComponentSize.LARGE}
              disabled={isUsingLedgerWallet || disableSubmitButton}
              onClick={() => {
                updateMessage({
                  status: ActionStatus.SUBMITTING,
                  id: action.id,
                });
              }}
            >
              {t('Sign')}
            </PrimaryButton>
          </HorizontalFlex>
        </SignTxErrorBoundary>
      </VerticalFlex>
      <Dialog
        onClose={() => window.close()}
        open={showNotSupportedDialog}
        content={notSupportedDialog}
        bgColorDefault
      />
    </>
  );
}
