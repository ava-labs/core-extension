import {
  toast,
  TransactionToast,
  TransactionToastType,
} from '@avalabs/react-components';
import React from 'react';
import { Redirect } from 'react-router-dom';

interface SwapTxSuccessProps {
  swapTxHash: string;
}

export function SwapTxSuccess({ swapTxHash }: SwapTxSuccessProps) {
  toast.custom(
    <TransactionToast
      status="Swap Successful!"
      type={TransactionToastType.SUCCESS}
      text="View in Explorer"
      href={`https://snowtrace.io/tx/${swapTxHash}`}
    />
  );
  return <Redirect to="/home" />;
}
