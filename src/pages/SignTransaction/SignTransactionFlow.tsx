import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  SubTextTypography,
  LoadingIcon,
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
import React, { useState } from 'react';
import { ApproveTx } from './ApproveTx';
import { SwapTx } from './SwapTx';
import { UnknownTx } from './UnknownTx';
import { useGetTransaction } from './useGetTransaction';
import { AddLiquidityTx } from './AddLiquidityTx';
import { TransactionInProgress } from './TransactionInProgress';
import { CustomGasLimitAndFees } from './CustomGasLimitAndFees';
import { CustomSpendLimit } from './CustomSpendLimit';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTheme } from 'styled-components';
import { TransactionConfirmation } from './TransactionConfirmation';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const {
    updateTransaction,
    id,
    contractType,
    hash,
    setCustomFee,
    showCustomFees,
    setShowCustomFees,
    ...params
  } = useGetTransaction(requestId);
  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const { network } = useNetworkContext();
  const theme = useTheme();

  const [showCustomSpendLimit, setShowCustomSpendLimit] = useState(false);

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
        token={displayData.tokenToBeApproved}
        onCancel={() => setShowCustomSpendLimit(false)}
        onSpendLimitChanged={(spendLimit: string) => {
          id &&
            updateTransaction({
              status: TxStatus.PENDING,
              id: id,
              params: [{ spendLimit }],
            });
        }}
      />
    );
  }

  return (
    <VerticalFlex width="100%" align="center">
      <HorizontalFlex>
        <SubTextTypography size={12}>{network?.name} C-Chain</SubTextTypography>
      </HorizontalFlex>

      {/* Actions  */}
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
            />
          ),
          [ContractCall.ADD_LIQUIDITY]: (
            <AddLiquidityTx {...(displayData as AddLiquidityDisplayData)} />
          ),
          [ContractCall.ADD_LIQUIDITY_AVAX]: (
            <AddLiquidityTx {...(displayData as AddLiquidityDisplayData)} />
          ),
          ['unknown']: <UnknownTx />,
        }[contractType || 'unknown']
      }

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
              }).then(() => {
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

export default SignTransactionPage;
