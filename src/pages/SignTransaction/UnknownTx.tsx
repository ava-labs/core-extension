import { Typography, VerticalFlex } from '@avalabs/react-components';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';
import React from 'react';
import { AddressPaths } from './components/AddressPaths';
import { TransactionTabs } from './components/TransactionTabs';

export function UnknownTx({
  fromAddress,
  toAddress,
  fee,
  feeUSD,
  txParams,
  setShowCustomFees,
}: TransactionDisplayValues & { setShowCustomFees: (show: boolean) => void }) {
  return (
    <VerticalFlex align={'center'} width="100%">
      <Typography size={24} weight={700} margin={'8px 0 16px 0'}>
        Transaction Summary
      </Typography>
      <AddressPaths fromAddress={fromAddress} toAddress={toAddress} />

      {/* Tabs */}
      <TransactionTabs
        fee={fee}
        feeUSD={feeUSD}
        setShowCustomFees={setShowCustomFees}
        byteStr={txParams?.data}
      />
    </VerticalFlex>
  );
}
