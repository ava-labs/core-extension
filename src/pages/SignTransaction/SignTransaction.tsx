import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  ComponentSize,
  LoadingSpinnerIcon,
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
import { useEffect, useState } from 'react';
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
import { getTransactionLink } from '@avalabs/wallet-react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

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
  const explorerUrl = getTransactionLink(hash, !network?.isTestnet);
  useLedgerDisconnectedDialog(() => {
    window.close();
  });

  function cancelHandler() {
    updateTransaction({
      status: TxStatus.ERROR_USER_CANCELED,
      id: id,
    });
  }
  useEffect(() => {
    window.addEventListener('unload', cancelHandler);

    return () => {
      window.removeEventListener('unload', cancelHandler);
    };
    // This only needs to run once since this is a part of initializing process.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayData: TransactionDisplayValues = { ...params } as any;

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
        site={displayData.site}
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
                  hash={hash}
                  error={txFailedError}
                  setShowCustomSpendLimit={setShowCustomSpendLimit}
                  displaySpendLimit={displaySpendLimit}
                  onCustomFeeSet={setCustomFee}
                  selectedGasFee={selectedGasFee}
                />
              ),
              [ContractCall.ADD_LIQUIDITY]: (
                <AddLiquidityTx
                  {...(displayData as AddLiquidityDisplayData)}
                  transactionState={transactionProgressState}
                  hash={hash}
                  error={txFailedError}
                  onCustomFeeSet={setCustomFee}
                  selectedGasFee={selectedGasFee}
                />
              ),
              [ContractCall.ADD_LIQUIDITY_AVAX]: (
                <AddLiquidityTx
                  {...(displayData as AddLiquidityDisplayData)}
                  transactionState={transactionProgressState}
                  hash={hash}
                  error={txFailedError}
                  onCustomFeeSet={setCustomFee}
                  selectedGasFee={selectedGasFee}
                />
              ),
              ['unknown']: (
                <UnknownTx
                  {...(displayData as TransactionDisplayValues)}
                  transactionState={transactionProgressState}
                  hash={hash}
                  error={txFailedError}
                  onCustomFeeSet={setCustomFee}
                  selectedGasFee={selectedGasFee}
                />
              ),
            }[contractType || 'unknown']
          }
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
