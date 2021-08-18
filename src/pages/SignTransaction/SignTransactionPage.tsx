import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';
import { TxStatus } from '@src/background/services/transactions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import React from 'react';
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
    transaction,
    updateTransaction,
    hash,
  } = useGetTransaction(requestId);

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
                  updateTransaction({
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
                  updateTransaction({
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
