import { Typography, VerticalFlex } from '@avalabs/react-components';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';
import { AddressPaths } from './components/AddressPaths';
import { TransactionTabs } from './components/TransactionTabs';

export function UnknownTx({
  fromAddress,
  toAddress,
  txParams,
  gasPrice,
  gasLimit,
  onCustomFeeSet,
}: TransactionDisplayValues) {
  return (
    <VerticalFlex align={'center'} width="100%">
      <Typography size={24} weight={700} margin={'8px 0 16px 0'}>
        Transaction Summary
      </Typography>
      <AddressPaths fromAddress={fromAddress} toAddress={toAddress} />

      {/* Tabs */}
      <TransactionTabs
        byteStr={txParams?.data}
        gasPrice={gasPrice}
        limit={gasLimit?.toString() as string}
        onCustomFeeSet={onCustomFeeSet}
      />
    </VerticalFlex>
  );
}
