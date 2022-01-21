import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  SubTextTypography,
  LoadingIcon,
  ConnectionIndicator,
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
import { useState } from 'react';
import { ApproveTx } from './ApproveTx';
import { SwapTx } from './SwapTx';
import { UnknownTx } from './UnknownTx';
import { useGetTransaction } from './hooks/useGetTransaction';
import { AddLiquidityTx } from './AddLiquidityTx';
import { TransactionInProgress } from './TransactionInProgress';
import { CustomGasLimitAndFees } from './CustomGasLimitAndFees';
import { CustomSpendLimit } from './CustomSpendLimit';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTheme } from 'styled-components';
import {
  TransactionConfirmation,
  TransactionFailure,
} from './TransactionConfirmedOrFailed';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { SignTxRenderErrorBoundary } from './components/SignTxRenderErrorBoundary';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const { isWalletReady } = useWalletContext();
  const {
    updateTransaction,
    id,
    contractType,
    hash,
    setCustomFee,
    showCustomFees,
    setShowCustomFees,
    showCustomSpendLimit,
    setShowCustomSpendLimit,
    setSpendLimit,
    displaySpendLimit,
    customSpendLimit,
    isRevokeApproval,
    ...params
  } = useGetTransaction(requestId);
  const [showTxInProgress, setShowTxInProgress] = useState<boolean>(false);
  const { network } = useNetworkContext();
  const theme = useTheme();
  const [txFailedError, setTxFailedError] = useState<string>();

  const displayData: TransactionDisplayValues = { ...params } as any;

  if (!Object.keys(displayData).length) {
    return (
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  if (showTxInProgress) {
    return <TransactionInProgress isOpen={true} />;
  }

  if (txFailedError) {
    return (
      <TransactionFailure
        message={txFailedError as string}
        txId={hash}
        onClose={() => window.close()}
      />
    );
  }

  if (hash) {
    return (
      <TransactionConfirmation txId={hash} onClose={() => window.close()} />
    );
  }

  if (showCustomFees) {
    return (
      <CustomGasLimitAndFees
        limit={displayData.gasLimit?.toString() as string}
        gasPrice={displayData.gasPrice}
        onCancel={() => setShowCustomFees(false)}
        onSave={(gas, gasLimit) => {
          setShowCustomFees(false);
          setCustomFee(gasLimit, gas);
        }}
      />
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
    <VerticalFlex width="100%" align="center">
      <HorizontalFlex align="center">
        <ConnectionIndicator
          disableTooltip={true}
          size={8}
          connected={isWalletReady}
        />
        <SubTextTypography margin={'0 0 0 5px'} size={12}>
          {network?.name} C-Chain
        </SubTextTypography>
      </HorizontalFlex>

      {/* Actions  */}
      <SignTxRenderErrorBoundary>
        {
          {
            [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS]: (
              <SwapTx
                {...(displayData as SwapExactTokensForTokenDisplayValues)}
                setShowCustomFees={setShowCustomFees}
              />
            ),
            [ContractCall.APPROVE]: (
              <ApproveTx
                {...(displayData as ApproveTransactionData)}
                setShowCustomFees={setShowCustomFees}
                setShowCustomSpendLimit={setShowCustomSpendLimit}
                displaySpendLimit={displaySpendLimit}
                isRevokeApproval={isRevokeApproval}
              />
            ),
            [ContractCall.ADD_LIQUIDITY]: (
              <AddLiquidityTx
                {...(displayData as AddLiquidityDisplayData)}
                setShowCustomFees={setShowCustomFees}
              />
            ),
            [ContractCall.ADD_LIQUIDITY_AVAX]: (
              <AddLiquidityTx
                {...(displayData as AddLiquidityDisplayData)}
                setShowCustomFees={setShowCustomFees}
              />
            ),
            ['unknown']: (
              <UnknownTx
                {...(displayData as TransactionDisplayValues)}
                setShowCustomFees={setShowCustomFees}
              />
            ),
          }[contractType || 'unknown']
        }
      </SignTxRenderErrorBoundary>

      {/* Action Buttons */}
      <HorizontalFlex
        flex={1}
        align="flex-end"
        width={'100%'}
        justify={'space-between'}
      >
        <SecondaryButton
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
          onClick={() => {
            setShowTxInProgress(true);
            id &&
              updateTransaction({
                status: TxStatus.SUBMITTING,
                id: id,
              })
                .catch((err) => {
                  setTxFailedError(err);
                })
                .finally(() => {
                  setShowTxInProgress(false);
                });
          }}
        >
          Approve
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
