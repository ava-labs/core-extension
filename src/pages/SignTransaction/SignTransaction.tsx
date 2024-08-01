import {
  Box,
  Button,
  CodeIcon,
  IconButton,
  LoadingDots,
  Scrollbars,
  Skeleton,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { BN } from 'bn.js';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback, useMemo, useState } from 'react';
import { useGetTransaction } from './hooks/useGetTransaction';
import { LedgerApprovalOverlay } from './components/LedgerApprovalOverlay';
import { SignTxErrorBoundary } from './components/SignTxErrorBoundary';
import { useLedgerDisconnectedDialog } from './hooks/useLedgerDisconnectedDialog';
import { TransactionProgressState } from './models';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenType } from '@src/background/services/balances/models';
import { Trans, useTranslation } from 'react-i18next';
import { RawTransactionData } from './components/RawTransactionData';
import { CustomFees } from '@src/components/common/CustomFees';
import { useSignTransactionHeader } from './hooks/useSignTransactionHeader';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { KeystoneApprovalOverlay } from './components/KeystoneApprovalOverlay';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import Dialog from '@src/components/common/Dialog';
import { TransactionErrorDialog } from './components/TransactionErrorDialog';
import { WalletConnectApprovalOverlay } from './components/WalletConnectApproval/WalletConnectApprovalOverlay';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import { useApprovalHelpers } from '@src/hooks/useApprovalHelpers';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import { FireblocksApprovalOverlay } from './components/FireblocksApproval/FireblocksApprovalOverlay';
import { TxBalanceChange } from './components/TxBalanceChange';
import { TransactionActionInfo } from './components/TransactionActionInfo/TransactionActionInfo';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { NetworkDetails, WebsiteDetails } from './components/ApprovalTxDetails';
import { getToAddressesFromTransaction } from './utils/getToAddressesFromTransaction';
import { SpendLimitInfo } from './components/SpendLimitInfo/SpendLimitInfo';
import { ActionStatus } from '@src/background/services/actions/models';
import { MaliciousTxAlert } from '@src/components/common/MaliciousTxAlert';
import { TxWarningBox } from '@src/components/common/TxWarningBox';

export function SignTransactionPage() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const onTxError = useCallback(() => {
    window.close();
  }, []);
  const {
    updateTransaction,
    setCustomFee,
    showRawTransactionData,
    setShowRawTransactionData,
    selectedGasFee,
    network,
    networkFee,
    hasTransactionError,
    setHasTransactionError,
    transaction,
    maxFeePerGas,
    gasLimit,
    fee,
  } = useGetTransaction(requestId);

  const [transactionProgressState, setTransactionProgressState] = useState(
    TransactionProgressState.NOT_APPROVED
  );
  const tokens = useTokensWithBalances({
    chainId: network?.chainId,
  });
  const header = useSignTransactionHeader(transaction?.displayData);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isUsingFireblocksAccount = useIsUsingFireblocksAccount();

  const nativeTokenWithBalance = useMemo(
    () => tokens.find(({ type }) => type === TokenType.NATIVE),
    [tokens]
  );
  const hasEnoughForNetworkFee = useMemo(() => {
    return nativeTokenWithBalance?.balance.gte(
      new BN(
        (transaction?.displayData?.displayValues?.gas.maxFeePerGas
          ? transaction.displayData?.displayValues?.gas.maxFeePerGas *
            BigInt(transaction.displayData?.displayValues?.gas.gasLimit || 0n)
          : 0n
        ).toString()
      )
    );
  }, [
    nativeTokenWithBalance?.balance,
    transaction?.displayData?.displayValues?.gas.gasLimit,
    transaction?.displayData?.displayValues?.gas.maxFeePerGas,
  ]);

  const cancelHandler = useCallback(() => {
    if (transaction?.actionId) {
      updateTransaction({
        status: ActionStatus.ERROR_USER_CANCELED,
        id: transaction?.actionId,
      });
    }
  }, [transaction?.actionId, updateTransaction]);

  useLedgerDisconnectedDialog(cancelHandler, undefined, network);
  useWindowGetsClosedOrHidden(cancelHandler);

  const isReadyForApproval =
    nativeTokenWithBalance &&
    transactionProgressState === TransactionProgressState.NOT_APPROVED;

  const submit = useCallback(async () => {
    setTransactionProgressState(TransactionProgressState.PENDING);
    await updateTransaction(
      {
        status: ActionStatus.SUBMITTING,
        id: transaction?.actionId,
      },
      true
    );
  }, [transaction?.actionId, updateTransaction]);

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: submit,
      onReject: cancelHandler,
    });

  if (!transaction) {
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

  if (showRawTransactionData) {
    return (
      <RawTransactionData
        data={transaction.displayData?.txParams?.data}
        onClose={() => setShowRawTransactionData(false)}
      />
    );
  }

  const isTransactionMalicious =
    transaction.displayData.displayValues.isMalicious;
  const isTransactionSuspicious =
    transaction.displayData.displayValues.isSuspicious;

  return (
    <>
      <MaliciousTxAlert
        showAlert={isTransactionMalicious}
        cancelHandler={cancelHandler}
      />
      {isApprovalOverlayVisible && (
        <>
          {isUsingLedgerWallet && (
            <LedgerApprovalOverlay
              fee={fee}
              feeSymbol={network?.networkToken.symbol}
              {...getToAddressesFromTransaction(transaction.displayData)}
            />
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
          height: '100%',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        {header && (
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
            <Typography variant="h4">{header}</Typography>
          </Box>
        )}
        {/* Actions  */}
        <Scrollbars>
          <Stack
            sx={{
              flex: 1,
              width: '100%',
              px: 2,
              gap: 3,
              pb: 3,
            }}
          >
            <SignTxErrorBoundary>
              <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
                <ApprovalSection>
                  <TxWarningBox
                    isMalicious={isTransactionMalicious}
                    isSuspicious={isTransactionSuspicious}
                  />

                  <ApprovalSectionHeader label={t('Transaction Details')}>
                    <IconButton
                      size="small"
                      sx={{ px: 0, minWidth: 'auto' }}
                      onClick={() => setShowRawTransactionData(true)}
                    >
                      <CodeIcon />
                    </IconButton>
                  </ApprovalSectionHeader>
                  <ApprovalSectionBody sx={{ py: 1 }}>
                    {transaction.site && (
                      <WebsiteDetails site={transaction.site} />
                    )}
                    {network && <NetworkDetails network={network} />}

                    <TransactionActionInfo transaction={transaction} />
                  </ApprovalSectionBody>
                </ApprovalSection>
              </Stack>
              <SpendLimitInfo
                transaction={transaction}
                updateTransaction={updateTransaction}
              />
              <TxBalanceChange transaction={transaction} />

              <Stack sx={{ gap: 1, width: '100%' }}>
                {maxFeePerGas !== undefined && gasLimit ? (
                  <CustomFees
                    maxFeePerGas={maxFeePerGas}
                    limit={gasLimit}
                    onChange={setCustomFee}
                    selectedGasFeeModifier={selectedGasFee}
                    network={network}
                    networkFee={networkFee}
                  />
                ) : (
                  <>
                    <Skeleton variant="text" width="100%" />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="136px"
                    />
                  </>
                )}

                {!hasEnoughForNetworkFee && (
                  <Stack sx={{ width: '100%', alignItems: 'flex-start' }}>
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
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
        </Scrollbars>

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
              transactionProgressState !== TransactionProgressState.NOT_APPROVED
            }
            size="large"
            fullWidth
            onClick={() => {
              transaction?.actionId &&
                updateTransaction({
                  status: ActionStatus.ERROR_USER_CANCELED,
                  id: transaction?.actionId,
                });
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
                status: ActionStatus.ERROR,
                id: transaction?.actionId,
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
