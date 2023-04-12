import {
  Box,
  Button,
  LoadingDots,
  Skeleton,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import {
  AddLiquidityDisplayData,
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
  ApproveTransactionData,
} from '@src/contracts/contractParsers/models';
import {
  TransactionDisplayValues,
  TransactionDisplayValuesWithGasData,
  TxStatus,
} from '@src/background/services/transactions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback, useMemo, useState } from 'react';
import { ApproveTx } from './ApproveTx';
import { SwapTx } from './SwapTx';
import { UnknownTx } from './UnknownTx';
import { useGetTransaction } from './hooks/useGetTransaction';
import { AddLiquidityTx } from './AddLiquidityTx';
import { LedgerApprovalOverlay } from './LedgerApprovalOverlay';
import { CustomSpendLimit } from './CustomSpendLimit';
import { SignTxRenderErrorBoundary } from './components/SignTxRenderErrorBoundary';
import { useLedgerDisconnectedDialog } from './hooks/useLedgerDisconnectedDialog';
import { TransactionProgressState } from './models';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { BigNumber } from 'ethers';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenType } from '@src/background/services/balances/models';
import { ethersBigNumberToBN, hexToBN } from '@avalabs/utils-sdk';
import { Trans, useTranslation } from 'react-i18next';
import { RawTransactionData } from './components/RawTransactionData';
import { CustomFeesK2 } from '@src/components/common/CustomFeesK2';
import { useSignTransactionHeader } from './hooks/useSignTransactionHeader';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { KeystoneApprovalOverlay } from './KeystoneApprovalOverlay';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';

const hasGasPriceData = (
  displayData: TransactionDisplayValues
): displayData is TransactionDisplayValuesWithGasData => {
  return (
    displayData.maxFeePerGas instanceof BigNumber &&
    typeof displayData.gasLimit === 'number' &&
    displayData.gasLimit > 0
  );
};

export function SignTransactionPage() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const onTxError = useCallback(() => {
    window.close();
  }, []);
  const {
    updateTransaction,
    id,
    contractType,
    setCustomFee,
    showCustomSpendLimit,
    setShowCustomSpendLimit,
    showRawTransactionData,
    setShowRawTransactionData,
    setSpendLimit,
    displaySpendLimit,
    limitFiatValue,
    customSpendLimit,
    selectedGasFee,
    suggestedFee,
    network,
    networkFee,
    ...params
  } = useGetTransaction(requestId, onTxError);
  const [transactionProgressState, setTransactionProgressState] = useState(
    TransactionProgressState.NOT_APPROVED
  );
  const tokens = useTokensWithBalances(false, network?.chainId);
  const header = useSignTransactionHeader(contractType);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

  useLedgerDisconnectedDialog(window.close, undefined, network);

  const hasTokenBalance = useMemo(
    () => tokens.find((t) => t.type === TokenType.NATIVE)?.balance,
    [tokens]
  );
  const hasEnoughForNetworkFee = useMemo(() => {
    return tokens
      .find((t) => t.type === TokenType.NATIVE)
      ?.balance.gte(
        ethersBigNumberToBN(
          params.maxFeePerGas?.mul(params.gasLimit || BigNumber.from(0)) ??
            BigNumber.from(0)
        )
      );
  }, [tokens, params.maxFeePerGas, params.gasLimit]);

  const cancelHandler = useCallback(() => {
    updateTransaction({
      status: TxStatus.ERROR_USER_CANCELED,
      id: id,
    });
  }, [id, updateTransaction]);

  useWindowGetsClosedOrHidden(cancelHandler);

  const displayData: TransactionDisplayValues = {
    ...params,
    contractType,
  };

  const hasFeeInformation = Boolean(networkFee) && hasGasPriceData(displayData);
  const isReadyForApproval =
    hasTokenBalance &&
    hasFeeInformation &&
    transactionProgressState === TransactionProgressState.NOT_APPROVED;

  const requestedApprovalLimit = displayData.approveData
    ? hexToBN(displayData.approveData.limit)
    : undefined;

  const onApproveClick = () => {
    setTransactionProgressState(TransactionProgressState.PENDING);
    id &&
      updateTransaction({
        status: TxStatus.SUBMITTING,
        id: id,
      }).finally(() => window.close());

    /*
    When wallet type is ledger or keystone, we need to show to the user that the interaction with the device is needed. 
    In this case, the popup will stay open until the promise from updateTransaction is resolved. 
      */
    if (!isUsingLedgerWallet && !isUsingKeystoneWallet) {
      window.close();
    }
  };

  if (!Object.keys(displayData).length) {
    return (
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LoadingDots size={20} />
      </Stack>
    );
  }

  if (showCustomSpendLimit) {
    return (
      <CustomSpendLimit
        site={displayData.site || { domain: 'unkown' }}
        requestedApprovalLimit={requestedApprovalLimit}
        spendLimit={customSpendLimit}
        token={displayData.tokenToBeApproved}
        onClose={() => setShowCustomSpendLimit(false)}
        setSpendLimit={setSpendLimit}
      />
    );
  }

  if (showRawTransactionData) {
    return (
      <RawTransactionData
        data={displayData.txParams?.data}
        onClose={() => setShowRawTransactionData(false)}
      />
    );
  }

  return (
    <>
      {transactionProgressState === TransactionProgressState.PENDING && (
        <>
          <LedgerApprovalOverlay displayData={displayData} />
          <KeystoneApprovalOverlay
            onReject={() => {
              if (id) {
                updateTransaction({
                  status: TxStatus.ERROR_USER_CANCELED,
                  id: id,
                });
                window.close();
              }
            }}
          />
        </>
      )}
      <Stack
        sx={{
          width: '100%',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        {header && (
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'background.default',
              pt: 1,
              pb: 2,
              px: 2,
              zIndex: 1,
              height: '56px',
            }}
          >
            <Typography
              component="h1"
              sx={{ fontSize: 24, fontWeight: 'bold' }}
            >
              {header}
            </Typography>
          </Box>
        )}
        {/* Actions  */}
        <Stack
          sx={{
            flex: 1,
            overflow: 'scroll',
            width: '100%',
            px: 2,
            gap: 3,
            pb: 5,
          }}
        >
          <SignTxRenderErrorBoundary>
            {
              {
                [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS]: (
                  <SwapTx
                    {...(displayData as SwapExactTokensForTokenDisplayValues)}
                    setShowRawTransactionData={setShowRawTransactionData}
                    network={network}
                  />
                ),
                [ContractCall.APPROVE]: (
                  <ApproveTx
                    {...(displayData as ApproveTransactionData)}
                    setShowCustomSpendLimit={setShowCustomSpendLimit}
                    setShowRawTransactionData={setShowRawTransactionData}
                    displaySpendLimit={displaySpendLimit}
                    requestedApprovalLimit={requestedApprovalLimit}
                    limitFiatValue={limitFiatValue}
                    network={network}
                  />
                ),
                [ContractCall.ADD_LIQUIDITY]: (
                  <AddLiquidityTx
                    {...(displayData as AddLiquidityDisplayData)}
                    setShowRawTransactionData={setShowRawTransactionData}
                    network={network}
                  />
                ),
                [ContractCall.ADD_LIQUIDITY_AVAX]: (
                  <AddLiquidityTx
                    {...(displayData as AddLiquidityDisplayData)}
                    setShowRawTransactionData={setShowRawTransactionData}
                    network={network}
                  />
                ),
                ['unknown']: (
                  <UnknownTx
                    {...(displayData as TransactionDisplayValues)}
                    setShowRawTransactionData={setShowRawTransactionData}
                    network={network}
                  />
                ),
              }[contractType || 'unknown']
            }

            <Stack sx={{ gap: 1, width: '100%' }}>
              {hasFeeInformation ? (
                <CustomFeesK2
                  maxFeePerGas={displayData.maxFeePerGas}
                  limit={displayData.gasLimit}
                  onChange={setCustomFee}
                  selectedGasFeeModifier={selectedGasFee}
                  network={network}
                  networkFee={networkFee}
                  suggestedNetworkFee={suggestedFee}
                />
              ) : (
                <>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rectangular" width="100%" height="136px" />
                </>
              )}

              {!hasEnoughForNetworkFee && (
                <Stack sx={{ width: '100%', alignItems: 'flex-start' }}>
                  <Typography
                    sx={{ color: 'error.main', fontSize: 'caption.fontSize' }}
                  >
                    <Trans
                      i18nKey="Insufficient balance to cover gas costs. <br /> Please add {{symbol}}."
                      values={{ symbol: network?.networkToken.symbol }}
                    />
                  </Typography>
                </Stack>
              )}
            </Stack>
          </SignTxRenderErrorBoundary>
        </Stack>

        {/* Action Buttons */}
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '100%',
            justifyContent: 'space-between',
            pt: 3,
            px: 2,
            pb: 1,
          }}
        >
          <Button
            color="secondary"
            data-testid="transaction-reject-btn"
            disabled={
              transactionProgressState !== TransactionProgressState.NOT_APPROVED
            }
            sx={{ width: 168, maxHeight: 40, height: 40 }}
            onClick={() => {
              id &&
                updateTransaction({
                  status: TxStatus.ERROR_USER_CANCELED,
                  id: id,
                });
              window.close();
            }}
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="transaction-approve-btn"
            disabled={!hasEnoughForNetworkFee || !isReadyForApproval}
            isLoading={!isReadyForApproval}
            sx={{ width: 168, maxHeight: 40, height: 40 }}
            onClick={onApproveClick}
          >
            {t('Approve')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
