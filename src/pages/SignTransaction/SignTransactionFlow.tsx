import {
  HorizontalFlex,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
  Typography,
  SubTextTypography,
} from '@avalabs/react-components';
import {
  AddLiquidityDisplayData,
  ContractCall,
  SwapExactTokensForTokenDisplayValues,
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
import { SendInProgress } from '../Send/SendInProgress';
import { SendConfirmation } from '../Send/SendConfirmation';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const { updateTransaction, id, contractType, hash, ...params } =
    useGetTransaction(requestId);
  const [showTxInProgress, setShowTxInProgress] = useState(false);

  const displayData: TransactionDisplayValues = { ...params } as any;

  if (showTxInProgress) {
    return <SendInProgress isOpen={true} />;
  }

  if (hash) {
    return (
      <SendConfirmation
        isOpen={true}
        txId={hash}
        onClose={() => window.close()}
      />
    );
  }

  return (
    <VerticalFlex>
      {
        {
          [ContractCall.SWAP_EXACT_TOKENS_FOR_TOKENS]: (
            <SwapTx
              {...(displayData as SwapExactTokensForTokenDisplayValues)}
            />
          ),
          [ContractCall.APPROVE]: <ApproveTx />,
          [ContractCall.ADD_LIQUIDITY]: (
            <AddLiquidityTx {...(displayData as AddLiquidityDisplayData)} />
          ),
          [ContractCall.ADD_LIQUIDITY_AVAX]: (
            <AddLiquidityTx {...(displayData as AddLiquidityDisplayData)} />
          ),
          ['unknown']: <UnknownTx />,
        }[contractType || 'unknown']
      }
      <br />
      <br />
      <br />
      <VerticalFlex width={'100%'} align={'center'}>
        <Typography>Fee</Typography>
        <br />
        <Typography> {displayData.fee} (AVAX)</Typography>
        <SubTextTypography>${displayData.feeUSD}</SubTextTypography>
      </VerticalFlex>
      <br />
      <br />
      <HorizontalFlex width={'100%'} justify={'space-between'}>
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
          Cancel
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
