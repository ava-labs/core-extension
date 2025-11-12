import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';
import { TransactionDetailItem } from '@/components/common/approval/TransactionDetailItem';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { MaliciousTxAlert } from '@/components/common/MaliciousTxAlert';
import {
  useAnalyticsContext,
  useNetworkFeeContext,
  useNetworkContext,
  useApproveAction,
  useGetRequestId,
  useIsUsingKeystoneWallet,
  useIsUsingLedgerWallet,
  useLiveBalance,
} from '@core/ui';
import {
  Alert,
  AlertContent,
  AlertTitle,
  Box,
  Button,
  Scrollbars,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import {
  AlertType,
  DisplayData,
  RpcMethod,
  TokenType,
} from '@avalabs/vm-module-types';
import { ActionStatus, GaslessPhase, NetworkWithCaipId } from '@core/types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertBox } from '../Permissions/components/AlertBox';
import { WarningBox } from '../Permissions/components/WarningBox';
import { getSendErrorMessage } from '../Send/utils/sendErrorMessages';
import { NetworkDetails } from '../SignTransaction/components/ApprovalTxDetails';
import { useFeeCustomizer } from './hooks/useFeeCustomizer';
import { TxBalanceChange } from '../SignTransaction/components/TxBalanceChange';
import { SpendLimitInfo } from '../SignTransaction/components/SpendLimitInfo/SpendLimitInfo';
import { DeviceApproval } from './components/DeviceApproval';
import { useLedgerDisconnectedDialog } from '@/hooks/useLedgerDisconnectedDialog';
import { useKeystone3DisconnectedDialog } from '@/hooks/useKeystone3DisconnectedDialog';

type WithContextAlert = {
  alert: { type: 'info'; title: string; notice: string };
};

function hasContextInfo(
  context?: Record<string, unknown>,
): context is WithContextAlert {
  return (
    typeof context === 'object' &&
    context !== null &&
    'alert' in context &&
    Boolean(context.alert)
  );
}

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20]; // Approval screen should always have the latest balance

export function GenericApprovalScreen() {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } =
    useApproveAction<DisplayData>(requestId);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const [network, setNetwork] = useState<NetworkWithCaipId>();
  const { getNetwork } = useNetworkContext();
  const {
    isCalculatingFee,
    isFeeConfigured,
    feeError,
    hasEnoughForNetworkFee,
    renderFeeWidget,
  } = useFeeCustomizer({
    action,
    network,
  });
  const {
    isGaslessOn,
    gaslessFundTx,
    fundTxHex,
    setGaslessDefaultValues,
    gaslessPhase,
    setGaslessEligibility,
    fetchAndSolveGaslessChallange,
    isGaslessEligible,
  } = useNetworkFeeContext();

  const { captureEncrypted } = useAnalyticsContext();

  const { displayData, context, signingData, caipId } = action ?? {};
  const hasFeeSelector = action?.displayData.networkFeeSelector;
  const isFeeValid =
    (isGaslessOn && isGaslessEligible) ||
    !hasFeeSelector ||
    (!feeError &&
      !isCalculatingFee &&
      hasEnoughForNetworkFee &&
      isFeeConfigured);

  useEffect(() => {
    if (!caipId) {
      return;
    }

    setNetwork(getNetwork(caipId));

    if (signingData && signingData.type === RpcMethod.ETH_SEND_TRANSACTION) {
      const evmChainId = caipId.split(':')[1] ?? '';

      setGaslessEligibility(
        evmChainId,
        signingData?.data?.from,
        signingData?.data?.nonce,
      );
      return;
    }
    setGaslessEligibility(caipId);
  }, [
    caipId,
    fetchAndSolveGaslessChallange,
    getNetwork,
    setGaslessEligibility,
    signingData,
  ]);

  useEffect(() => {
    if (gaslessPhase === GaslessPhase.NOT_READY && isGaslessEligible) {
      fetchAndSolveGaslessChallange();
    }
  }, [fetchAndSolveGaslessChallange, gaslessPhase, isGaslessEligible]);

  const handleRejection = useCallback(() => {
    setGaslessDefaultValues();
    cancelHandler();
  }, [cancelHandler, setGaslessDefaultValues]);

  const signTx = useCallback(async () => {
    if (isGaslessOn && isGaslessEligible) {
      return await gaslessFundTx(action?.signingData);
    }
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet || isUsingKeystoneWallet,
    );
  }, [
    action?.signingData,
    gaslessFundTx,
    isGaslessEligible,
    isGaslessOn,
    isUsingKeystoneWallet,
    isUsingLedgerWallet,
    requestId,
    updateAction,
  ]);

  useEffect(() => {
    if (gaslessPhase === GaslessPhase.ERROR) {
      captureEncrypted('GaslessFundFailed');
    }
    if (gaslessPhase === GaslessPhase.FUNDED && fundTxHex) {
      captureEncrypted('GaslessFundSuccessful', {
        fundTxHex,
      });
      updateAction(
        {
          status: ActionStatus.SUBMITTING,
          id: requestId,
        },
        isUsingLedgerWallet || isUsingKeystoneWallet,
      );
      setGaslessDefaultValues();
    }
  }, [
    captureEncrypted,
    fundTxHex,
    gaslessPhase,
    isUsingKeystoneWallet,
    isUsingLedgerWallet,
    network,
    requestId,
    setGaslessDefaultValues,
    t,
    updateAction,
  ]);

  // Make the user switch to the correct app or close the window
  useLedgerDisconnectedDialog(handleRejection, undefined, network);
  useKeystone3DisconnectedDialog(handleRejection);

  if (!action || !displayData) {
    return <LoadingOverlay />;
  }

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: '100%',
            pt: 1,
            pb: 2,
            px: 2,
            zIndex: 1,
            minHeight: '56px',
          }}
        >
          <Typography variant="h4">
            {(context?.customApprovalScreenTitle as string) ||
              displayData.title}
          </Typography>
        </Box>

        {displayData.alert && (
          <Stack sx={{ width: 1, px: 2, mb: 1 }}>
            {displayData.alert.type === AlertType.DANGER ? (
              <>
                <MaliciousTxAlert
                  showAlert
                  cancelHandler={handleRejection}
                  actionTitles={displayData.alert.details.actionTitles}
                  title={displayData.alert.details.title}
                  description={displayData.alert.details.description}
                />
                <AlertBox
                  title={displayData.alert.details.title}
                  text={displayData.alert.details.description}
                />
              </>
            ) : (
              <WarningBox
                title={displayData.alert.details.title}
                text={displayData.alert.details.description}
              />
            )}
          </Stack>
        )}

        {gaslessPhase === GaslessPhase.ERROR && (
          <Stack sx={{ width: 1, px: 2, mb: 1 }}>
            <AlertBox
              title={t('Gasless Error')}
              text={t(
                `We're unable to cover the gas fees for your transaction at this time. As a result, this feature has been disabled.`,
              )}
            />
          </Stack>
        )}

        {hasContextInfo(context) && (
          <Stack sx={{ width: 1, px: 2 }}>
            <Alert
              severity={context.alert.type}
              sx={{ width: 1, py: 0, mb: 1, mt: -1 }}
            >
              <AlertTitle>{context.alert.title}</AlertTitle>
              {context.alert.notice && (
                <AlertContent>{context.alert.notice}</AlertContent>
              )}
            </Alert>
          </Stack>
        )}

        <Scrollbars>
          <Stack sx={{ flex: 1, width: 1, px: 2, gap: 2, pb: 3 }}>
            <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
              {displayData.details.map((section, sectionIndex) => (
                <ApprovalSection key={`tx-detail-section-${sectionIndex}`}>
                  {section.title && (
                    <ApprovalSectionHeader label={section.title} />
                  )}
                  <ApprovalSectionBody sx={{ py: 1 }}>
                    {sectionIndex === 0 && network && (
                      <NetworkDetails network={network} />
                    )}
                    {section.items.map((item, index) => (
                      <TransactionDetailItem
                        key={`tx-detail.${sectionIndex}.${index}`}
                        item={item}
                      />
                    ))}
                  </ApprovalSectionBody>
                </ApprovalSection>
              ))}
              {displayData.balanceChange && (
                <TxBalanceChange
                  ins={displayData.balanceChange.ins}
                  outs={displayData.balanceChange.outs}
                  isSimulationSuccessful={displayData.isSimulationSuccessful}
                />
              )}
              {displayData.tokenApprovals && (
                <SpendLimitInfo
                  {...displayData.tokenApprovals}
                  actionId={requestId}
                />
              )}
            </Stack>
            {isGaslessEligible === null ? (
              <Stack
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Skeleton sx={{ width: '100%', height: 140 }} />
              </Stack>
            ) : (
              displayData.networkFeeSelector && renderFeeWidget()
            )}
          </Stack>
        </Scrollbars>
        {feeError && !isGaslessOn && isGaslessEligible !== null && (
          <Typography variant="caption" color="error.main" sx={{ mt: -1 }}>
            {getSendErrorMessage(feeError)}
          </Typography>
        )}
      </Stack>
      {/* Action Buttons */}
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          width: '100%',
          justifyContent: 'space-between',
          pt: 1.5,
          px: 2,
          pb: 1,
          gap: 1,
        }}
      >
        <Button
          color="secondary"
          data-testid="transaction-reject-btn"
          disabled={
            action.status === ActionStatus.SUBMITTING ||
            gaslessPhase === GaslessPhase.FUNDING_IN_PROGRESS
          }
          size="large"
          fullWidth
          onClick={handleRejection}
        >
          {t('Reject')}
        </Button>
        <Tooltip
          title={
            gaslessPhase === GaslessPhase.NOT_READY &&
            isGaslessOn &&
            t(
              `If you're looking to approve the transaction despite the gasless feature, please turn it off to proceed.`,
            )
          }
          sx={{ width: '100%' }}
        >
          <Button
            data-testid="transaction-approve-btn"
            disabled={
              !displayData ||
              action.status === ActionStatus.SUBMITTING ||
              !isFeeValid ||
              (isGaslessOn &&
                (gaslessPhase === GaslessPhase.FUNDING_IN_PROGRESS ||
                  gaslessPhase !== GaslessPhase.READY))
            }
            isLoading={
              action.status === ActionStatus.SUBMITTING ||
              isCalculatingFee ||
              gaslessPhase === GaslessPhase.FUNDING_IN_PROGRESS
            }
            size="large"
            fullWidth
            onClick={signTx}
          >
            {gaslessPhase === GaslessPhase.FUNDING_IN_PROGRESS
              ? t('Approving')
              : (context?.customApprovalButtonText as string) || t('Approve')}
          </Button>
        </Tooltip>
      </Stack>
      <DeviceApproval
        action={action}
        handleRejection={handleRejection}
        network={network}
      />
    </Stack>
  );
}
