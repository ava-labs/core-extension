import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';
import { TxStatus } from '@src/background/services/transactions/models';
import { transactionService } from '@src/background/services/transactions/transactions';
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
    <>
      {!hash ? (
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
      ) : (
        <VerticalFlex>
          <Typography>Tx Finished</Typography>
          <Typography>{hash}</Typography>
          <HorizontalFlex>
            <PrimaryButton onClick={() => window.close()}>Close</PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      )}
    </>
  );
}

export default SignTransactionPage;
