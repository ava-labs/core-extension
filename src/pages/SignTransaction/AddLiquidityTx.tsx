import {
  HorizontalFlex,
  PlusIcon,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { AddLiquidityDisplayData } from '@src/contracts/contractParsers/models';
import { Fragment } from 'react';
import { useTheme } from 'styled-components';
import { AddressPaths } from './components/AddressPaths';
import { TokenCard } from './components/TokenCard';
import { TransactionTabs } from './components/TransactionTabs';

export function AddLiquidityTx({
  poolTokens,
  toAddress,
  fromAddress,
  setShowCustomFees,
  fee,
  feeUSD,
  txParams,
}: AddLiquidityDisplayData) {
  const theme = useTheme();

  const plusIcon = (
    <HorizontalFlex width={'100%'} justify={'center'} margin="8px 0">
      <PlusIcon color={theme.colors.icon1} height="16px" />
    </HorizontalFlex>
  );

  return (
    <VerticalFlex width={'100%'}>
      {/* Header */}
      <HorizontalFlex margin="8px 0 32px 0" width={'100%'} justify={'center'}>
        <Typography as="h1" size={24} weight={700}>
          Adding Liquidity to Pool
        </Typography>
      </HorizontalFlex>

      {/* Account */}
      <AddressPaths toAddress={toAddress} fromAddress={fromAddress} />

      {/* Tokens */}
      {poolTokens.map((token, index) => (
        <Fragment key={token.symbol}>
          <TokenCard
            token={token}
            margin={`${!index && '16px 0 0 0'}`}
            displayValue={token.amountDepositedDisplayValue}
            amount={token.amountUSDValue}
          />
          {!index && plusIcon}
        </Fragment>
      ))}

      {/* Tabs */}
      <TransactionTabs
        fee={fee}
        feeUSD={feeUSD}
        byteStr={txParams?.data}
        setShowCustomFees={setShowCustomFees}
      />
    </VerticalFlex>
  );
}
