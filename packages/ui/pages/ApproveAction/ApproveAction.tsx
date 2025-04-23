import { DAppProviderRequest } from '@core/service-worker';
import { ActionStatus } from '@core/service-worker';
import { useApproveAction } from '@src/hooks/useApproveAction';
import Scrollbars from 'react-custom-scrollbars-2';
import { useGetRequestId } from '../../hooks/useGetRequestId';
import { SignTxErrorBoundary } from '../SignTransaction/components/SignTxErrorBoundary';
import { BridgeTransferAsset } from './BridgeTransferAsset';
import { useTranslation } from 'react-i18next';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerApprovalOverlay } from '../SignTransaction/components/LedgerApprovalOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import { KeystoneApprovalOverlay } from '../SignTransaction/components/KeystoneApprovalOverlay';
import {
  CircularProgress,
  Stack,
  Typography,
  Button,
  useTheme,
} from '@avalabs/core-k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from 'packages/ui/src/components/common/approval/ApprovalSection';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import { WalletConnectApprovalOverlay } from '../SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay';
import { useApprovalHelpers } from '@src/hooks/useApprovalHelpers';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import { FireblocksApprovalOverlay } from '../SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { FunctionIsOffline } from 'packages/ui/src/components/common/FunctionIsOffline';

export function ApproveAction() {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } = useApproveAction(requestId);
  const { network } = useNetworkContext();
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isFireblocksAccount = useIsUsingFireblocksAccount();
  const { isFunctionAvailable: isSigningAvailable } = useIsFunctionAvailable(
    FunctionNames.SIGN,
  );

  const submitHandler = async () => {
    await updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet ||
        isUsingKeystoneWallet ||
        isWalletConnectAccount ||
        isFireblocksAccount, // wait for the response only for device wallets
    );
  };

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: submitHandler,
      onReject: cancelHandler,
    });

  useLedgerDisconnectedDialog(() => handleRejection(), undefined, network);

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

  if (!isSigningAvailable) {
    return (
      <FunctionIsOffline functionName={FunctionNames.FEATURE} hidePageTitle />
    );
  }

  const renderDeviceApproval = () => {
    if (isApprovalOverlayVisible) {
      if (isUsingLedgerWallet) return <LedgerApprovalOverlay />;
      else if (isUsingKeystoneWallet)
        return <KeystoneApprovalOverlay onReject={handleRejection} />;
      else if (isWalletConnectAccount)
        return (
          <WalletConnectApprovalOverlay
            onSubmit={handleApproval}
            onReject={handleRejection}
          />
        );
      else if (isFireblocksAccount)
        return (
          <FireblocksApprovalOverlay
            onSubmit={handleApproval}
            onReject={handleRejection}
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
              onClick={handleRejection}
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
              onClick={handleApproval}
            >
              {t('Approve')}
            </Button>
          </Stack>
        </SignTxErrorBoundary>
      </Stack>
    </>
  );
}
