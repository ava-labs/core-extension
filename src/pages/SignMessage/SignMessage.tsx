import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useApproveAction } from '@src/hooks/useApproveAction';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';

import { EthSign } from './components/EthSign';
import { PersonalSign } from './components/PersonalSign';
import { SignData } from './components/SignData';
import { SignDataV3 } from './components/SignDataV3';
import { SignDataV4 } from './components/SignDataV4';
import { SignTxErrorBoundary } from '../SignTransaction/components/SignTxErrorBoundary';
import { useIsIntersecting } from './hooks/useIsIntersecting';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { LedgerApprovalOverlay } from '@src/pages/SignTransaction/components/LedgerApprovalOverlay';
import { WalletConnectApprovalOverlay } from '../SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import { useApprovalHelpers } from '@src/hooks/useApprovalHelpers';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import { FireblocksApprovalOverlay } from '../SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { AccountType } from '@src/background/services/accounts/models';
import { truncateAddress } from '@src/utils/truncateAddress';

export function SignMessage() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const {
    action,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction(requestId);

  // TODO: remove this in https://ava-labs.atlassian.net/browse/CP-5617
  // Message signing is not currently supported by the Ledger Avalanche app
  // We also disable the "Sign" button
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isFireblocksAccount = useIsUsingFireblocksAccount();
  const { isFunctionAvailable: isSigningAvailable } = useIsFunctionAvailable(
    FunctionNames.SIGN
  );
  const {
    accounts: { active: activeAccount, primary: primaryAccounts },
  } = useAccountsContext();

  const [showNotSupportedDialog, setShowNotSupportedDialog] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [messageAlertClosed, setMessageAlertClosed] = useState(false);
  const endContentRef = useRef(null);
  const isIntersecting = useIsIntersecting({ ref: endContentRef });
  const disabledForLedger = useMemo(() => {
    return (
      isUsingLedgerWallet &&
      action &&
      action.method !== DAppProviderRequest.AVALANCHE_SIGN_MESSAGE
    );
  }, [isUsingLedgerWallet, action]);

  const signingAccountAddress = useMemo(() => {
    if (!action || !activeAccount) {
      return;
    }
    const accountIndex = action.displayData.messageParams.accountIndex;
    if (
      accountIndex === undefined ||
      activeAccount.type !== AccountType.PRIMARY
    ) {
      return action.method === DAppProviderRequest.AVALANCHE_SIGN_MESSAGE
        ? activeAccount.addressAVM?.slice(2)
        : activeAccount.addressC;
    }

    const accountToUse = primaryAccounts[activeAccount.walletId]?.find(
      (account) => account.index === accountIndex
    );

    return action.method === DAppProviderRequest.AVALANCHE_SIGN_MESSAGE
      ? accountToUse?.addressAVM?.slice(2)
      : accountToUse?.addressC;
  }, [action, activeAccount, primaryAccounts]);

  const signMessage = useCallback(async () => {
    await updateMessage(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet || isUsingWalletConnectAccount || isFireblocksAccount // wait for the response only for device wallets
    );
  }, [
    updateMessage,
    requestId,
    isUsingLedgerWallet,
    isUsingWalletConnectAccount,
    isFireblocksAccount,
  ]);

  useEffect(() => {
    if (isIntersecting) {
      viewCompleteHandler();
    }
  }, [isIntersecting]);
  function viewCompleteHandler() {
    setDisableSubmitButton(false);
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
    if (disabledForLedger) {
      setShowNotSupportedDialog(true);
    }
  }, [disabledForLedger]);

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: signMessage,
      onReject: cancelHandler,
    });

  const renderDeviceApproval = () => {
    if (isApprovalOverlayVisible) {
      if (isUsingWalletConnectAccount) {
        return (
          <WalletConnectApprovalOverlay
            onReject={handleRejection}
            onSubmit={handleApproval}
          />
        );
      } else if (isFireblocksAccount) {
        return (
          <FireblocksApprovalOverlay
            onReject={handleRejection}
            onSubmit={handleApproval}
          />
        );
      }
    }

    if (isUsingLedgerWallet && action?.status === ActionStatus.SUBMITTING) {
      return <LedgerApprovalOverlay />;
    }

    return null;
  };

  useLedgerDisconnectedDialog(() => handleRejection(), LedgerAppType.AVALANCHE);

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
        <Button sx={{ mb: 1 }} onClick={handleRejection}>
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

  if (!isSigningAvailable) {
    return (
      <FunctionIsOffline functionName={FunctionNames.FEATURE} hidePageTitle />
    );
  }

  return (
    <Stack sx={{ px: 2, width: 1, height: 1 }}>
      {renderDeviceApproval()}

      <SignTxErrorBoundary variant="RenderError">
        <Stack sx={{ width: 1, height: 1, flexGrow: 1 }}>
          <Scrollbars>
            {!action.displayData.isMessageValid && !messageAlertClosed ? (
              <Alert
                sx={{
                  backgroundColor: 'common.black',
                }}
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
            ) : null}

            <Stack sx={{ py: 1.5 }}>
              <Typography variant="h4">
                {action.error ? t('Signing Failed') : t('Sign Message')}
              </Typography>
            </Stack>

            {/* No need to show domain metadata when request comes from the extension itself */}
            {action.site?.domain !== location.hostname && (
              <Stack sx={{ alignItems: 'center', pb: 1 }}>
                <SiteAvatar>
                  <TokenIcon height="48px" width="48px" src={action.site?.icon}>
                    <GlobeIcon size={48} />
                  </TokenIcon>
                </SiteAvatar>
                <Typography variant="h5">
                  {action.site?.name ?? t('Unknown')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 1,
                    wordWrap: 'break-word',
                  }}
                >
                  <Trans
                    i18nKey="{{domain}} requests you to sign the following message"
                    values={{
                      domain: action.site?.domain || 'A site',
                    }}
                  />
                </Typography>
                {signingAccountAddress && (
                  <Stack
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1,
                      px: 2,
                      flexDirection: 'row',
                      width: '100%',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 'fontWeightSemibold',
                      }}
                    >
                      {t('Active Wallet:')}
                    </Typography>
                    <Tooltip title={signingAccountAddress}>
                      <Typography
                        variant="body1"
                        sx={{
                          pl: 1,
                          fontWeight: 'fontWeightSemibold',
                        }}
                      >
                        {truncateAddress(signingAccountAddress)}
                      </Typography>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Actions  */}
            {
              {
                [MessageType.ETH_SIGN]: (
                  <EthSign
                    message={action.displayData.messageParams}
                    updateHandler={updateHandler}
                    ref={endContentRef}
                  />
                ),
                [MessageType.PERSONAL_SIGN]: (
                  <PersonalSign
                    message={action.displayData.messageParams}
                    updateHandler={updateHandler}
                    ref={endContentRef}
                  />
                ),
                [MessageType.AVALANCHE_SIGN]: (
                  <PersonalSign
                    message={action.displayData.messageParams}
                    updateHandler={updateHandler}
                    ref={endContentRef}
                  />
                ),
                [MessageType.SIGN_TYPED_DATA]: (
                  <SignData
                    message={action.displayData.messageParams}
                    updateHandler={updateHandler}
                    ref={endContentRef}
                  />
                ),
                [MessageType.SIGN_TYPED_DATA_V1]: (
                  <SignData
                    message={action.displayData.messageParams}
                    updateHandler={updateHandler}
                    ref={endContentRef}
                  />
                ),
                [MessageType.SIGN_TYPED_DATA_V3]: (
                  <SignDataV3
                    message={action.displayData.messageParams}
                    updateHandler={updateHandler}
                    ref={endContentRef}
                  />
                ),
                [MessageType.SIGN_TYPED_DATA_V4]: (
                  <SignDataV4
                    message={action.displayData.messageParams}
                    updateHandler={updateHandler}
                    ref={endContentRef}
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
                    style={{
                      flexGrow: 1,
                      maxHeight: 'unset',
                      height: '100%',
                    }}
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
                  'Scroll the message contents above to the very bottom to be able to continue'
                )}
              </Typography>
            </Stack>
          </Scrollbars>
        </Stack>

        {/* Action Buttons */}
        <Stack
          direction="row"
          sx={{
            flexGrow: 1,
            alignItems: 'flex-end',
            width: 1,
            justifyContent: 'space-between',
            pb: 1,
            pt: 2,
            gap: 1,
          }}
        >
          <Button
            color="secondary"
            size="large"
            fullWidth
            onClick={handleRejection}
          >
            {t('Reject')}
          </Button>
          <Button
            color="primary"
            size="large"
            disabled={disabledForLedger || disableSubmitButton}
            onClick={handleApproval}
            fullWidth
          >
            {t('Approve')}
          </Button>
        </Stack>
      </SignTxErrorBoundary>
      <Dialog
        onClose={() => window.close()}
        open={showNotSupportedDialog}
        content={notSupportedDialog}
        bgColorDefault
      />
    </Stack>
  );
}
