import { Typography, VerticalFlex } from '@avalabs/react-components';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';
import React from 'react';
import { AddressPaths } from './components/AddressPaths';

export function UnknownTx({
  fromAddress,
  toAddress,
}: TransactionDisplayValues) {
  return (
    <VerticalFlex align={'center'} width="100%">
      <Typography size={24} weight={700} margin={'8px 0 16px 0'}>
        Transaction Summary
      </Typography>
      <AddressPaths fromAddress={fromAddress} toAddress={toAddress} />
    </VerticalFlex>
  );
}
