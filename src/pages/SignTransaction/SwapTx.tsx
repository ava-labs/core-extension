import {
  StubbyArrowIcon,
  HorizontalFlex,
  IconDirection,
  VerticalFlex,
} from '@avalabs/react-components';
import { SwapExactTokensForTokenDisplayValues } from '@src/contracts/contractParsers/models';
import { useTheme } from 'styled-components';
import { AddressPaths } from './components/AddressPaths';
import { SuccessFailTxInfo } from './components/SuccessFailTxInfo';
import { TokenCard } from './components/TokenCard';
import { TransactionHeader } from './components/TransactionHeader';
import { TransactionTabs } from './components/TransactionTabs';
import { TransactionProgressData, TransactionProgressState } from './models';

export function SwapTx({
  path,
  toAddress,
  fromAddress,
  txParams,
  gasPrice,
  gasLimit,
  onCustomFeeSet,
  transactionState,
  hash,
  error,
  selectedGasFee,
}: SwapExactTokensForTokenDisplayValues & TransactionProgressData) {
  const [sentToken] = path;
  const receivingToken = path[path.length - 1];

  const theme = useTheme();

  return (
    <VerticalFlex width="100%">
      <TransactionHeader
        title="Approve Swap"
        transactionState={transactionState}
      />

      <VerticalFlex>
        <AddressPaths toAddress={toAddress} fromAddress={fromAddress} />
        {/* Top Token */}
        <TokenCard
          token={sentToken}
          margin={'16px 0 0 0'}
          displayValue={sentToken.amountIn?.value}
          amount={sentToken.amountUSDValue}
        />

        {/* arrow */}
        <HorizontalFlex width={'100%'} justify={'center'} padding={'8px 0'}>
          <StubbyArrowIcon
            height="16px"
            color={theme.colors.icon1}
            direction={IconDirection.DOWN}
          />
        </HorizontalFlex>

        {/* Bottom token */}
        <TokenCard
          token={receivingToken}
          displayValue={receivingToken.amountOut?.value}
          amount={receivingToken.amountUSDValue}
        />

        {/* Tabs */}
        {transactionState === TransactionProgressState.NOT_APPROVED ? (
          <TransactionTabs
            byteStr={txParams?.data}
            gasPrice={gasPrice}
            limit={gasLimit}
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
