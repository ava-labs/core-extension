import { ActionStatus } from '@src/background/services/actions/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { satoshiToBtc } from '@avalabs/core-bridge-sdk';
import { useTranslation } from 'react-i18next';
import { ChainId } from '@avalabs/core-chains-sdk';
import { DisplayData, RpcMethod } from '@avalabs/vm-module-types';
import { LedgerAppType } from '@src/contexts/LedgerProvider';
import {
  Box,
  Button,
  Scrollbars,
  Skeleton,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { LedgerApprovalOverlay } from '@src/pages/SignTransaction/components/LedgerApprovalOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import { KeystoneApprovalOverlay } from '../SignTransaction/components/KeystoneApprovalOverlay';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { SendErrorMessage } from '@src/utils/send/models';
import { buildBtcTx } from '@src/utils/send/btcSendUtils';
import { getSendErrorMessage } from '../Send/utils/sendErrorMessages';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { getNetworkCaipId } from '@src/utils/caipConversion';
import { TransactionDetailItem } from '@src/components/common/approval/TransactionDetailItem';

export function BitcoinSignTx() {
  const { t } = useTranslation();
  const { network, networks, bitcoinProvider } = useNetworkContext();
  const { getNetworkFee } = useNetworkFeeContext();
  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } =
    useApproveAction<DisplayData>(requestId);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const [error, setError] = useState<SendErrorMessage>();
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);

  const { displayData, context } = action ?? {};
  const signingData = useMemo(
    () =>
      action?.signingData?.type === RpcMethod.BITCOIN_SEND_TRANSACTION
        ? action.signingData
        : null,
    [action]
  );
  const btcTxData = signingData?.data;

  const [networkFee, setNetworkFee] = useState<NetworkFee | null>();

  useEffect(() => {
    let isMounted = true;

    if (!network) {
      return;
    }
    // If the request comes from a dApp, a different network may be active,
    // so we need to fetch current fees for Bitcoin specifically.
    getNetworkFee(getNetworkCaipId(network)).then((fee) => {
      if (isMounted) {
        setNetworkFee(fee);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getNetworkFee, network]);

  const btcNetwork = useMemo(() => {
    const networkID = network?.isTestnet
      ? ChainId.BITCOIN_TESTNET
      : ChainId.BITCOIN;

    const foundNetwork = networks.filter(
      (networkItem) => networkItem.chainId === networkID
    );

    return foundNetwork[0];
  }, [network, networks]);

  const btcAmountDisplay = useMemo(
    () => (btcTxData ? satoshiToBtc(btcTxData.amount).toFixed(8) : '-'),
    [btcTxData]
  );

  const sendFeeDisplay = useMemo(() => {
    return btcTxData ? satoshiToBtc(btcTxData.fee).toFixed(8) : '-';
  }, [btcTxData]);

  const renderDeviceApproval = () => {
    if (action?.status !== ActionStatus.SUBMITTING) {
      return null;
    }

    if (isUsingLedgerWallet) {
      return (
        <LedgerApprovalOverlay
          to={btcTxData?.to}
          amount={btcAmountDisplay}
          symbol="BTC"
          fee={sendFeeDisplay}
          feeSymbol="BTC"
        />
      );
    }

    if (isUsingKeystoneWallet) {
      return <KeystoneApprovalOverlay onReject={handleRejection} />;
    }
  };

  const [gasFeeModifier, setGasFeeModifier] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );
  const [customFeeRate, setCustomFeeRate] = useState(btcTxData?.feeRate ?? 0);

  const setCustomFee = useCallback(
    (values: { maxFeePerGas: bigint; feeType: GasFeeModifier }) => {
      const newFeeRate = Number(values.maxFeePerGas);

      setCustomFeeRate(newFeeRate);
      setGasFeeModifier(values.feeType);
    },
    []
  );

  useEffect(
    () => {
      if (
        !customFeeRate ||
        !action ||
        !signingData ||
        !bitcoinProvider ||
        !btcTxData
      ) {
        return;
      }

      let isMounted = true;

      setIsCalculatingFee(true);
      buildBtcTx(signingData.account, bitcoinProvider, {
        amount: btcTxData.amount,
        address: btcTxData.to,
        token: btcTxData.balance,
        feeRate: customFeeRate,
      })
        .then((tx) => {
          if (!isMounted) {
            return;
          }

          if (btcTxData.amount > 0 && !tx.psbt) {
            setError(SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE);
          } else if (tx.psbt) {
            setError(undefined);
          }

          // Only update if the action wasn't already submitted/cancelled
          if (action.status === ActionStatus.PENDING) {
            updateAction({
              id: action.actionId,
              status: ActionStatus.PENDING,
              signingData: {
                ...signingData,
                data: {
                  ...btcTxData,
                  fee: tx.fee,
                  feeRate: customFeeRate,
                },
              },
            });
          }
        })
        .catch((err) => {
          console.error(err);
          setError(SendErrorMessage.UNKNOWN_ERROR);
        })
        .finally(() => {
          setIsCalculatingFee(false);
        });

      return () => {
        isMounted = false;
      };
    },
    // Keeping displayData out of here, as the only way it updates is through this UI,
    // and having it here would result in render loops.
    // eslint-disable-next-line
    [
      action?.actionId,
      action?.status,
      error,
      customFeeRate,
      updateAction,
      bitcoinProvider,
    ]
  );

  const handleRejection = useCallback(() => {
    cancelHandler();
  }, [cancelHandler]);

  const signTx = useCallback(() => {
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      isUsingLedgerWallet || isUsingKeystoneWallet
    );
  }, [requestId, updateAction, isUsingLedgerWallet, isUsingKeystoneWallet]);

  // Make the user switch to the correct app or close the window
  useLedgerDisconnectedDialog(handleRejection, LedgerAppType.BITCOIN);

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

        <Scrollbars>
          <Stack sx={{ flex: 1, width: 1, px: 2, gap: 2, pb: 3 }}>
            <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
              {displayData.details.map((section, sectionIndex) => (
                <ApprovalSection key={`tx-detail-section-${sectionIndex}`}>
                  {section.title && (
                    <ApprovalSectionHeader label={section.title} />
                  )}
                  <ApprovalSectionBody sx={{ py: 1 }}>
                    {section.items.map((item, index) => (
                      <TransactionDetailItem
                        key={`tx-detail.${sectionIndex}.${index}`}
                        item={item}
                      />
                    ))}
                  </ApprovalSectionBody>
                </ApprovalSection>
              ))}
            </Stack>
            {displayData.networkFeeSelector &&
              (networkFee && btcTxData ? (
                <CustomFees
                  maxFeePerGas={BigInt(btcTxData.feeRate)}
                  limit={Math.ceil(btcTxData.fee / btcTxData.feeRate)}
                  onChange={setCustomFee}
                  selectedGasFeeModifier={gasFeeModifier}
                  network={btcNetwork}
                  networkFee={networkFee}
                />
              ) : (
                <Stack sx={{ gap: 0.5, justifyContent: 'flex-start' }}>
                  <Skeleton variant="text" width={120} />
                  <Skeleton variant="rounded" height={128} />
                </Stack>
              ))}
          </Stack>
        </Scrollbars>
        {error && (
          <Typography variant="caption" color="error.main" sx={{ mt: -1 }}>
            {getSendErrorMessage(error)}
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
            Boolean(error) ||
            isCalculatingFee
          }
          isLoading={
            action.status === ActionStatus.SUBMITTING || isCalculatingFee
          }
          size="large"
          fullWidth
          onClick={signTx}
        >
          {t('Approve')}
        </Button>
      </Stack>
      {renderDeviceApproval()}
    </Stack>
  );
}
