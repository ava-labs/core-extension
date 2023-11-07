import {
  Box,
  Button,
  LoadingDots,
  Skeleton,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { BN } from 'bn.js';
import {
  AddLiquidityDisplayData,
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
  ApproveTransactionData,
  SimpleSwapDisplayValues,
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
import { SignTxErrorBoundary } from './components/SignTxErrorBoundary';
import { useLedgerDisconnectedDialog } from './hooks/useLedgerDisconnectedDialog';
import { TransactionProgressState } from './models';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenType } from '@src/background/services/balances/models';
import { hexToBN } from '@avalabs/utils-sdk';
import { Trans, useTranslation } from 'react-i18next';
import { RawTransactionData } from './components/RawTransactionData';
import { CustomFees } from '@src/components/common/CustomFees';
import { useSignTransactionHeader } from './hooks/useSignTransactionHeader';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { KeystoneApprovalOverlay } from './KeystoneApprovalOverlay';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import Dialog from '@src/components/common/Dialog';
import { TransactionErrorDialog } from './TransactionErrorDialog';
import { WalletConnectApprovalOverlay } from './WalletConnectApprovalOverlay';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import { useApprovalHelpers } from '@src/hooks/useApprovalHelpers';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import { FireblocksApprovalOverlay } from './FireblocksApprovalOverlay';

const hasGasPriceData = (
  displayData: TransactionDisplayValues
): displayData is TransactionDisplayValuesWithGasData => {
  return (
    typeof displayData.maxFeePerGas === 'bigint' &&
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
    network,
    networkFee,
    hasTransactionError,
    setHasTransactionError,
    ...params
  } = useGetTransaction(requestId);
  const [transactionProgressState, setTransactionProgressState] = useState(
    TransactionProgressState.NOT_APPROVED
  );
  const tokens = useTokensWithBalances(false, network?.chainId);
  const header = useSignTransactionHeader(contractType);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isUsingFireblocksAccount = useIsUsingFireblocksAccount();

  useLedgerDisconnectedDialog(window.close, undefined, network);

  const hasTokenBalance = useMemo(
    () => tokens.find(({ type }) => type === TokenType.NATIVE)?.balance,
    [tokens]
  );
  const hasEnoughForNetworkFee = useMemo(() => {
    return tokens
      .find(({ type }) => type === TokenType.NATIVE)
      ?.balance.gte(
        new BN(
          (params.maxFeePerGas
            ? params.maxFeePerGas * BigInt(params.gasLimit || 0n)
            : 0n
          ).toString()
        )
      );
  }, [tokens, params.maxFeePerGas, params.gasLimit]);

  const cancelHandler = () => {
    if (id) {
      updateTransaction({
        status: TxStatus.ERROR_USER_CANCELED,
        id: id,
      });
      window.close();
    }
  };

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

  const submit = async () => {
    setTransactionProgressState(TransactionProgressState.PENDING);

    await updateTransaction({
      status: TxStatus.SUBMITTING,
      id: id,
    }).finally(() => window.close());
  };

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: submit,
      onReject: cancelHandler,
    });

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
      {isApprovalOverlayVisible && (
        <>
          {isUsingLedgerWallet && (
            <LedgerApprovalOverlay displayData={displayData} />
          )}

          {isUsingKeystoneWallet && (
            <KeystoneApprovalOverlay onReject={handleRejection} />
          )}

          {isUsingWalletConnectAccount && (
            <WalletConnectApprovalOverlay
              onReject={handleRejection}
              onSubmit={handleApproval}
            />
          )}
          {isUsingFireblocksAccount && (
            <FireblocksApprovalOverlay
              onReject={handleRejection}
              onSubmit={handleApproval}
            />
          )}
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
            overflow: 'auto',
            width: '100%',
            px: 2,
            gap: 3,
            pb: 5,
          }}
        >
          <SignTxErrorBoundary>
            {
              {
                [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS]: (
                  <SwapTx
                    {...(displayData as SwapExactTokensForTokenDisplayValues)}
                    setShowRawTransactionData={setShowRawTransactionData}
                    network={network}
                  />
                ),
                [ContractCall.SIMPLE_SWAP]: (
                  <SwapTx
                    {...(displayData as SimpleSwapDisplayValues)}
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
                <CustomFees
                  maxFeePerGas={displayData.maxFeePerGas}
                  limit={displayData.gasLimit}
                  onChange={setCustomFee}
                  selectedGasFeeModifier={selectedGasFee}
                  network={network}
                  networkFee={networkFee}
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
          </SignTxErrorBoundary>
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
            gap: 1,
          }}
        >
          <Button
            color="secondary"
            data-testid="transaction-reject-btn"
            disabled={
              transactionProgressState !== TransactionProgressState.NOT_APPROVED
            }
            size="large"
            fullWidth
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
            size="large"
            fullWidth
            onClick={handleApproval}
          >
            {t('Approve')}
          </Button>
        </Stack>
      </Stack>
      <Dialog
        onClose={() => window.close()}
        isCloseable={false}
        open={hasTransactionError}
        content={
          <TransactionErrorDialog
            onConfirm={async () => {
              updateTransaction({
                status: TxStatus.ERROR,
                id: id,
                error: 'Invalid param: chainId',
              });
              setHasTransactionError(false);
              if (onTxError) {
                onTxError();
              }
            }}
          />
        }
      />
    </>
  );
}
