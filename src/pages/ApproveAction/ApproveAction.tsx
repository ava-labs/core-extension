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

export function ApproveAction() {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action, updateAction } = useApproveAction(requestId);
  const { network } = useNetworkContext();
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

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

  const cancelHandler = () => {
    updateAction({
      status: ActionStatus.ERROR_USER_CANCELED,
      id: action.id,
    });
    window.close();
  };

  const renderDeviceApproval = () => {
    if (action.status === ActionStatus.SUBMITTING) {
      if (isUsingLedgerWallet)
        return <LedgerApprovalOverlay displayData={action.displayData} />;
      else if (isUsingKeystoneWallet)
        return <KeystoneApprovalOverlay onReject={cancelHandler} />;
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
              onClick={cancelHandler}
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
                updateAction(
                  {
                    status: ActionStatus.SUBMITTING,
                    id: action.id,
                  },
                  isUsingLedgerWallet || isUsingKeystoneWallet // wait for the response only for device wallets
                );
              }}
            >
              {t('Approve')}
            </Button>
          </Stack>
        </SignTxErrorBoundary>
      </Stack>
    </>
  );
}
