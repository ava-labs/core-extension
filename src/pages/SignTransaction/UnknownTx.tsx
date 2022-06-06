import {
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';
import { AddressPaths } from './components/AddressPaths';
import { SuccessFailTxInfo } from './components/SuccessFailTxInfo';
import { TransactionHeader } from './components/TransactionHeader';
import { TransactionTabs } from './components/TransactionTabs';
import { TransactionProgressState } from './models';

export function UnknownTx({
  fromAddress,
  toAddress,
  txParams,
  gasPrice,
  gasLimit,
  onCustomFeeSet,
  displayValue,
  name,
  transactionState,
  hash,
  error,
  selectedGasFee,
}: TransactionDisplayValues) {
  return (
    <VerticalFlex width="100%">
      <TransactionHeader
        title="Transaction Summary"
        transactionState={transactionState}
      />

      <VerticalFlex>
        {displayValue ? (
          <Typography margin={'8px 0 16px 0'}>{displayValue}</Typography>
        ) : (
          ''
        )}

        <AddressPaths fromAddress={fromAddress} toAddress={toAddress} />

        <Card margin="16px 0 0" padding="16px 0 16px" direction="column">
          <HorizontalFlex justify="space-between" padding="0 16px">
            <Typography size={12} height="15px">
              Transaction
            </Typography>
            <Typography size={12} height="15px">
              {name}
            </Typography>
          </HorizontalFlex>
        </Card>

        {/* Tabs */}
        {transactionState === TransactionProgressState.NOT_APPROVED ? (
          <TransactionTabs
            byteStr={txParams?.data}
            gasPrice={gasPrice}
            limit={gasLimit ?? 0}
            onCustomFeeSet={onCustomFeeSet}
            selectedGasFee={selectedGasFee}
          />
        ) : (
          <SuccessFailTxInfo
            hash={hash}
            gasPrice={gasPrice}
            gasLimit={gasLimit ?? 0}
            error={error}
          />
        )}
      </VerticalFlex>
    </VerticalFlex>
  );
}
