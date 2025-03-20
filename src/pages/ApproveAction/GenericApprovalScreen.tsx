import { ActionStatus } from '@src/background/services/actions/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback, useEffect, useState } from 'react';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useTranslation } from 'react-i18next';
import { AlertType, DisplayData, RpcMethod } from '@avalabs/vm-module-types';
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
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { getSendErrorMessage } from '../Send/utils/sendErrorMessages';
import { TransactionDetailItem } from '@src/components/common/approval/TransactionDetailItem';
import { useFeeCustomizer } from './hooks/useFeeCustomizer';
import { DeviceApproval } from './components/DeviceApproval';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { TxBalanceChange } from '../SignTransaction/components/TxBalanceChange';
import { AlertBox } from '../Permissions/components/AlertBox';
import { WarningBox } from '../Permissions/components/WarningBox';
import { MaliciousTxAlert } from '@src/components/common/MaliciousTxAlert';
import { SpendLimitInfo } from '../SignTransaction/components/SpendLimitInfo/SpendLimitInfo';
import { NetworkDetails } from '../SignTransaction/components/ApprovalTxDetails';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { toastCardWithLink } from '@src/utils/toastCardWithLink';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { GaslessPhase } from '@src/background/services/gasless/model';

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

export function GenericApprovalScreen() {
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
  } = useNetworkFeeContext();

  const { captureEncrypted } = useAnalyticsContext();

  const { displayData, context, signingData } = action ?? {};
  const hasFeeSelector = action?.displayData.networkFeeSelector;
  const isGaslessEligible = gaslessPhase !== GaslessPhase.NOT_ELIGIBLE;
  const isFeeValid =
    (isGaslessOn && isGaslessEligible) ||
    !hasFeeSelector ||
    (!feeError && !isCalculatingFee && hasEnoughForNetworkFee);

  useEffect(() => {
    if (!displayData?.network?.chainId) {
      return;
    }

    setNetwork(getNetwork(displayData.network.chainId));

    if (signingData && signingData.type === RpcMethod.ETH_SEND_TRANSACTION) {
      setGaslessEligibility(
        displayData.network.chainId,
        signingData?.data?.from,
        signingData?.data?.nonce,
      );
    }
  }, [
    displayData?.network?.chainId,
    getNetwork,
    setGaslessEligibility,
    signingData,
  ]);

  useEffect(() => {
    fetchAndSolveGaslessChallange();
  }, [fetchAndSolveGaslessChallange]);

  const handleRejection = useCallback(() => {
    setGaslessDefaultValues();
    cancelHandler();
  }, [cancelHandler, setGaslessDefaultValues]);

  const signTx = useCallback(async () => {
    if (isGaslessOn) {
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
      toastCardWithLink({
        title: t('Gas Fund Successful'),
        url: network && getExplorerAddressByNetwork(network, fundTxHex),
        label: t('View in Explorer'),
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
            height: '56px',
          }}
        >
          <Typography variant="h4">
            {context?.customApprovalScreenTitle || displayData.title}
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
              : context?.customApprovalButtonText || t('Approve')}
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
