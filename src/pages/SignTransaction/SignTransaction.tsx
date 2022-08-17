import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  ComponentSize,
  LoadingSpinnerIcon,
  Typography,
} from '@avalabs/react-components';
import {
  AddLiquidityDisplayData,
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
  ApproveTransactionData,
} from '@src/contracts/contractParsers/models';
import {
  TransactionDisplayValues,
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
import { useTheme } from 'styled-components';
import { SignTxRenderErrorBoundary } from './components/SignTxRenderErrorBoundary';
import { useLedgerDisconnectedDialog } from './hooks/useLedgerDisconnectedDialog';
import { TransactionProgressState } from './models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { TransactionTabs } from './components/TransactionTabs';
import { SuccessFailTxInfo } from './components/SuccessFailTxInfo';
import { BigNumber } from 'ethers';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenType } from '@src/background/services/balances/models';
import { ethersBigNumberToBN } from '@avalabs/utils-sdk';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const {
    updateTransaction,
    id,
    hash,
    contractType,
    setCustomFee,
    showCustomSpendLimit,
    setShowCustomSpendLimit,
    setSpendLimit,
    displaySpendLimit,
    customSpendLimit,
    selectedGasFee,
    ...params
  } = useGetTransaction(requestId);
  const [transactionProgressState, setTransactionProgressState] = useState(
    TransactionProgressState.NOT_APPROVED
  );
  const { network } = useNetworkContext();
  const theme = useTheme();
  const [txFailedError, setTxFailedError] = useState<string>();
  const explorerUrl = network && getExplorerAddressByNetwork(network, hash);
  const tokens = useTokensWithBalances();
  useLedgerDisconnectedDialog(window.close);

  const hasEnoughForNetworkFee = useMemo(() => {
    return tokens
      .find((t) => t.type === TokenType.NATIVE)
      ?.balance.gte(
        ethersBigNumberToBN(
          params.gasPrice?.mul(params.gasLimit || BigNumber.from(0)) ??
            BigNumber.from(0)
        )
      );
  }, [tokens, params.gasPrice, params.gasLimit]);

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

  const onApproveClick = () => {
    setTransactionProgressState(TransactionProgressState.PENDING);
    id &&
      updateTransaction({
        status: TxStatus.SUBMITTING,
        id: id,
      })
        .then(() => {
          setTransactionProgressState(TransactionProgressState.SUCCESS);
        })
        .catch((err) => {
          setTransactionProgressState(TransactionProgressState.ERROR);
          setTxFailedError(err);
        });
  };

  if (!Object.keys(displayData).length) {
    return (
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingSpinnerIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  if (showCustomSpendLimit) {
    return (
      <CustomSpendLimit
        site={displayData.site || { domain: 'unkown' }}
        spendLimit={customSpendLimit}
        token={displayData.tokenToBeApproved}
        onClose={() => setShowCustomSpendLimit(false)}
        setSpendLimit={setSpendLimit}
      />
    );
  }

  return (
    <>
      {transactionProgressState === TransactionProgressState.PENDING && (
        <LedgerApprovalOverlay displayData={displayData} />
      )}
      <VerticalFlex width="100%" padding="0 16px" align="center">
        {/* Actions  */}
        <SignTxRenderErrorBoundary>
          {
            {
              [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS]: (
                <SwapTx
                  {...(displayData as SwapExactTokensForTokenDisplayValues)}
                  transactionState={transactionProgressState}
                  hash={hash}
                  error={txFailedError}
                  onCustomFeeSet={setCustomFee}
                  selectedGasFee={selectedGasFee}
                />
              ),
              [ContractCall.APPROVE]: (
                <ApproveTx
                  {...(displayData as ApproveTransactionData)}
                  transactionState={transactionProgressState}
                  setShowCustomSpendLimit={setShowCustomSpendLimit}
                  displaySpendLimit={displaySpendLimit}
                />
              ),
              [ContractCall.ADD_LIQUIDITY]: (
                <AddLiquidityTx
                  {...(displayData as AddLiquidityDisplayData)}
                  transactionState={transactionProgressState}
                />
              ),
              [ContractCall.ADD_LIQUIDITY_AVAX]: (
                <AddLiquidityTx
                  {...(displayData as AddLiquidityDisplayData)}
                  transactionState={transactionProgressState}
                />
              ),
              ['unknown']: (
                <UnknownTx
                  {...(displayData as TransactionDisplayValues)}
                  transactionState={transactionProgressState}
                />
              ),
            }[contractType || 'unknown']
          }

          {/* Tabs */}
          {transactionProgressState ===
          TransactionProgressState.NOT_APPROVED ? (
            <TransactionTabs
              byteStr={displayData.txParams?.data}
              gasPrice={displayData.gasPrice}
              limit={displayData.gasLimit ?? 0}
              onCustomFeeSet={setCustomFee}
              selectedGasFee={selectedGasFee}
            />
          ) : (
            <SuccessFailTxInfo
              hash={hash}
              gasPrice={displayData.gasPrice ?? BigNumber.from(0)}
              gasLimit={displayData.gasLimit ?? 0}
              error={displayData.error}
            />
          )}
          {!hasEnoughForNetworkFee && (
            <VerticalFlex padding="16px 0" width="100%" align="flex-start">
              <Typography color="error" size={12}>
                Insufficient balance to cover gas costs. <br />
                Please add {network?.networkToken.symbol}.
              </Typography>
            </VerticalFlex>
          )}
        </SignTxRenderErrorBoundary>

        {/* Action Buttons */}
        <HorizontalFlex
          flex={1}
          align="flex-end"
          width="100%"
          justify="space-between"
          padding="0 0 8px"
        >
          {transactionProgressState ===
            TransactionProgressState.NOT_APPROVED && (
            <>
              <SecondaryButton
                size={ComponentSize.LARGE}
                width="168px"
                onClick={() => {
                  id &&
                    updateTransaction({
                      status: TxStatus.ERROR_USER_CANCELED,
                      id: id,
                    });
                  window.close();
                }}
              >
                Reject
              </SecondaryButton>
              <PrimaryButton
                disabled={!hasEnoughForNetworkFee}
                width="168px"
                size={ComponentSize.LARGE}
                onClick={onApproveClick}
              >
                Approve
              </PrimaryButton>
            </>
          )}
          {(transactionProgressState === TransactionProgressState.PENDING ||
            hash) && (
            <SecondaryButton
              size={ComponentSize.LARGE}
              width="100%"
              as="a"
              onClick={(e) => {
                if (!hash) {
                  e.preventDefault();
                }
              }}
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionProgressState === TransactionProgressState.PENDING ? (
                <LoadingSpinnerIcon color={theme.colors.icon1} height="24px" />
              ) : (
                'View on Explorer'
              )}
            </SecondaryButton>
          )}
        </HorizontalFlex>
      </VerticalFlex>
    </>
  );
}
