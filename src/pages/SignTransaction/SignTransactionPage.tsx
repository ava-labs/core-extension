import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';
import { transactionService } from '@src/background/services';
import { TxStatus } from '@src/background/services/transactionsAndMessages/transactions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useGetTransaction } from './useGetTransaction';

export function SignTransactionPage() {
  const requestId = useGetRequestId();
  const {
    fromAddress,
    toAddress,
    amount,
    gasEstimate,
    gasPrice,
    gasAvax,
    total,
    txParams,
    transaction,
  } = useGetTransaction(requestId);
  const [hash, setHash] = useState('');
  /**
   * Update the gas prices in storage
   */
  useEffect(() => {
    if (txParams && gasPrice && gasEstimate) {
      transactionService.updateTransactionParams(transaction?.id, {
        ...txParams,
        gas: gasEstimate.toString(),
        gasPrice: gasPrice,
      });
    }
  }, [gasPrice, gasEstimate]);

  useEffect(() => {
    transactionService
      .listenForTransactionFinalized(transaction?.id as string)
      .then((res) => {
        if (res) setHash(res);
      });
  }, []);

  return (
    <VerticalFlex>
      <HorizontalFlex>
        <Typography>from: {fromAddress}</Typography>
        <Typography>to: {toAddress}</Typography>
      </HorizontalFlex>
      <VerticalFlex>
        <Typography>amount: {amount}</Typography>
        <Typography>gas (gwei): {gasPrice}</Typography>
        <Typography>gas estimate: {gasEstimate}</Typography>
        <Typography>gas (avax): {gasAvax}</Typography>
        <Typography>total (avax): {total}</Typography>
      </VerticalFlex>
      <HorizontalFlex>
        <SecondaryButton
          onClick={() => {
            transaction?.id &&
              transactionService.updateTransactionStatus({
                status: TxStatus.ERROR_USER_CANCELED,
                id: transaction?.id,
              });
            window.close();
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            transaction?.id &&
              transactionService.updateTransactionStatus({
                status: TxStatus.SUBMITTING,
                id: transaction?.id,
              });
          }}
        >
          Approve
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
