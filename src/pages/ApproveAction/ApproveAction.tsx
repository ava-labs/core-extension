import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ActionStatus } from '@src/background/services/actions/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import Scrollbars from 'react-custom-scrollbars-2';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { SignTxErrorBoundary } from '../SignTransaction/components/SignTxErrorBoundary';
import { BridgeTransferAsset } from './BridgeTransferAsset';
import { useTranslation } from 'react-i18next';
import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerApprovalOverlay } from '../SignTransaction/LedgerApprovalOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import { KeystoneApprovalOverlay } from '../SignTransaction/KeystoneApprovalOverlay';
import {
  CircularProgress,
  Stack,
  Typography,
  Button,
  useTheme,
} from '@avalabs/k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import { WalletConnectApprovalOverlay } from '../SignTransaction/WalletConnectApprovalOverlay';
import { useState } from 'react';

export function ApproveAction() {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } = useApproveAction(requestId);
  const { network } = useNetworkContext();
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isWalletConnectAccount = useIsUsingWalletConnectAccount();
  const [isReadyToSignRemotely, setIsReadyToSignRemotely] = useState(false);

  useLedgerDisconnectedDialog(window.close, LedgerAppType.AVALANCHE, network);

  if (!action) {
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

  const onReject = () => {
    if (isReadyToSignRemotely) {
      setIsReadyToSignRemotely(false);
    }
    cancelHandler();
    window.close();
  };

  const submitHandler = () => {
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet || isUsingKeystoneWallet || isWalletConnectAccount // wait for the response only for device wallets
    );
  };

  const approveClickHandler = () => {
    if (isWalletConnectAccount) {
      setIsReadyToSignRemotely(true);
      return;
    }
    submitHandler();
  };

  const renderDeviceApproval = () => {
    if (action.status === ActionStatus.SUBMITTING || isReadyToSignRemotely) {
      if (isUsingLedgerWallet)
        return <LedgerApprovalOverlay displayData={action.displayData} />;
      else if (isUsingKeystoneWallet)
        return <KeystoneApprovalOverlay onReject={onReject} />;
      else if (isWalletConnectAccount)
        return (
          <WalletConnectApprovalOverlay
            onSubmit={submitHandler}
            onReject={onReject}
          />
        );
    }
  };

  return (
    <>
      <Stack sx={{ width: 1, px: 2 }}>
        <SignTxErrorBoundary>
          {renderDeviceApproval()}

          {/* Actions  */}
          {
            {
              [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET]: (
                <BridgeTransferAsset action={action} />
              ),
            }[action.method || 'unknown']
          }
          {action.error && (
            <ApprovalSection>
              <ApprovalSectionHeader label={t('Error')}></ApprovalSectionHeader>
              <ApprovalSectionBody sx={{ height: '105px', p: 1 }}>
                <Scrollbars
                  style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                >
                  <Stack>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.error.main,
                        wordBreak: 'break-all',
                      }}
                    >
                      {action.error}
                    </Typography>
                  </Stack>
                </Scrollbars>
              </ApprovalSectionBody>
            </ApprovalSection>
          )}

          {/* Action Buttons */}
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              width: '100%',
              justifyContent: 'space-between',
              pt: 3,
              pb: 1,
              gap: 1,
            }}
          >
            <Button
              color="secondary"
              data-testid="transaction-reject-btn"
              size="large"
              fullWidth
              disabled={action.status === ActionStatus.SUBMITTING}
              onClick={onReject}
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
              onClick={() => approveClickHandler()}
            >
              {t('Approve')}
            </Button>
          </Stack>
        </SignTxErrorBoundary>
      </Stack>
    </>
  );
}
