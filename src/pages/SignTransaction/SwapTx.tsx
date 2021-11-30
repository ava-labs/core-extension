import {
  StubbyArrowIcon,
  HorizontalFlex,
  IconDirection,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { SwapExactTokensForTokenDisplayValues } from '@src/contracts/contractParsers/models';
import React from 'react';
import { useTheme } from 'styled-components';
import { AddressPaths } from './components/AddressPaths';
import { TokenCard } from './components/TokenCard';
import { TransactionTabs } from './components/TransactionTabs';

export function SwapTx({
  path,
  fee,
  feeUSD,
  toAddress,
  fromAddress,
  setShowCustomFees,
  txParams,
}: SwapExactTokensForTokenDisplayValues) {
  const [sentToken] = path;
  const receivingToken = path[path.length - 1];

  const theme = useTheme();

  return (
    <VerticalFlex width="100%">
      {/* Header */}
      <HorizontalFlex margin="8px 0 32px 0" width={'100%'} justify={'center'}>
        <Typography as="h1" size={24} weight={700}>
          Approve Swap
        </Typography>
      </HorizontalFlex>

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
        <TransactionTabs
          fee={fee}
          feeUSD={feeUSD}
          setShowCustomFees={setShowCustomFees}
          byteStr={txParams?.data}
        />
      </VerticalFlex>
    </VerticalFlex>
  );
}
