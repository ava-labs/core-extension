import React from 'react';
import {
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { getAvaxBalanceTotal, getAvaxBalanceUSD } from './utils/balanceHelpers';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function WalletHomeBalances() {
  const { balances, avaxPrice } = useWalletContext();
  return (
    <Card>
      <HorizontalFlex justify={'space-between'} align={'center'} width={'100%'}>
        <Typography size={36} style={{ flex: 2 }}>
          $
          {parseFloat(
            getAvaxBalanceUSD(balances.balanceAvaxTotal, avaxPrice)
          ).toFixed(3)}{' '}
          USD
        </Typography>

        <VerticalFlex flex={1}>
          <Typography size={14} margin={'0 0 10px 0'}>
            Asset Allocation
          </Typography>
          <Typography size={14}>
            {getAvaxBalanceTotal(balances.balanceAvaxTotal)} AVAX
          </Typography>
        </VerticalFlex>
      </HorizontalFlex>
    </Card>
  );
}
