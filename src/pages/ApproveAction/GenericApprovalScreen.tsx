import { ActionStatus } from '@src/background/services/actions/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback, useEffect, useState } from 'react';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { useTranslation } from 'react-i18next';
import {
  AlertType,
  DisplayData,
  Network,
  RpcMethod,
} from '@avalabs/vm-module-types';
import {
  Alert,
  AlertContent,
  AlertTitle,
  Box,
  Button,
  Scrollbars,
  Stack,
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
    setIsGaslessEligible,
    getGaslessEligibility,
    gaslessFundTx,
    setIsGaslessOn,
  } = useNetworkFeeContext();
  const { captureEncrypted } = useAnalyticsContext();
  const [gaslessFundStarted, setGaslessFundStarted] = useState(false);
  const [gaslessError, setGaslessError] = useState('');
  //TODO: remove when implementing auto-retrying
  const [gaslessWarning, setGaslessWarning] = useState('');

  const { displayData, context } = action ?? {};
  const hasFeeSelector = action?.displayData.networkFeeSelector;
  const isFeeValid =
    !hasFeeSelector ||
    (!feeError && !isCalculatingFee && hasEnoughForNetworkFee);

  useEffect(() => {
    if (!displayData?.network?.chainId) {
      return;
    }
    const getGaslessStatus = async (chainId) =>
      setIsGaslessEligible(await getGaslessEligibility(chainId));

    setNetwork(getNetwork(displayData.network.chainId));
    getGaslessStatus(displayData.network.chainId);
  }, [
    displayData?.network?.chainId,
    getGaslessEligibility,
    getNetwork,
    setIsGaslessEligible,
  ]);

  const handleRejection = useCallback(() => {
    cancelHandler();
  }, [cancelHandler]);

  const handleGaslessError = useCallback(
    (e: string) => {
      const doNotRetryMessage = 'DO_NOT_RETRY';
      setIsGaslessOn(false);
      if (e.includes(doNotRetryMessage)) {
        setIsGaslessEligible(false);
        setGaslessError(
          t(
            `We're unable to cover the gas fees for your transaction at this time. As a result, this feature has been disabled.`,
          ),
        );
        return;
      }
      setGaslessWarning(
        t(
          'It seems there was a temporary issue with our gasless service while trying to fund your gas fee. Please give it another try! ',
        ),
      );
    },
    [setIsGaslessEligible, setIsGaslessOn, t],
  );

  const signTx = useCallback(async () => {
    setGaslessError('');
    if (isGaslessOn) {
      setGaslessFundStarted(true);
      if (action.signingData?.type === RpcMethod.ETH_SEND_TRANSACTION) {
        const fromAddress = action.signingData?.data.from;
        try {
          const foundTransactionHash = await gaslessFundTx({
            data: action.signingData?.data,
            fromAddress,
          });
          captureEncrypted('GaslessFundSuccessful', {
            address: fromAddress,
            txHash: foundTransactionHash,
            chainId: network?.chainId,
          });

          toastCardWithLink({
            title: t('Gas Fund Successful'),
            url: getExplorerAddressByNetwork(
              network as Network,
              foundTransactionHash,
            ),
            label: t('View in Explorer'),
          });
        } catch (e: any) {
          handleGaslessError(e);
          setGaslessFundStarted(false);
          return;
        }
      }

      setGaslessFundStarted(false);
    }
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet || isUsingKeystoneWallet,
    );
  }, [
    action?.signingData?.data,
    action?.signingData?.type,
    captureEncrypted,
    gaslessFundTx,
    handleGaslessError,
    isGaslessOn,
    isUsingKeystoneWallet,
    isUsingLedgerWallet,
    network,
    requestId,
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

        {gaslessError && (
          <Stack sx={{ width: 1, px: 2, mb: 1 }}>
            <AlertBox title={t('Gasless Error')} text={gaslessError} />
          </Stack>
        )}
        {gaslessWarning && (
          <Stack sx={{ width: 1, px: 2, mb: 1 }}>
            <WarningBox title={t('Gasless Warning')} text={gaslessWarning} />
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
            {displayData.networkFeeSelector && renderFeeWidget()}
          </Stack>
        </Scrollbars>
        {feeError && (
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
          disabled={action.status === ActionStatus.SUBMITTING}
          size="large"
          fullWidth
          onClick={handleRejection}
        >
          {t('Reject')}
        </Button>
        <Button
          data-testid="transaction-approve-btn"
          disabled={
            !displayData ||
            action.status === ActionStatus.SUBMITTING ||
            !isFeeValid ||
            gaslessFundStarted
          }
          isLoading={
            action.status === ActionStatus.SUBMITTING ||
            isCalculatingFee ||
            gaslessFundStarted
          }
          size="large"
          fullWidth
          onClick={signTx}
        >
          {t('Approve')}
        </Button>
      </Stack>
      <DeviceApproval
        action={action}
        handleRejection={handleRejection}
        network={network}
      />
    </Stack>
  );
}
