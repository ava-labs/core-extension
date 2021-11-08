import React from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  HorizontalFlex,
  SecondaryCard,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';

interface TokenListItemMiniModeProps {
  name: string;
  symbol: string;
  balanceDisplayValue?: string;
  children: any;
  balanceUSD?: string;
  onClick(): void;
}

export function TokenListItemMiniMode({
  name,
  symbol,
  balanceDisplayValue,
  children,
  balanceUSD,
  onClick,
}: TokenListItemMiniModeProps) {
  const theme = useTheme();
  const { currency, currencyFormatter } = useSettingsContext();
  return (
    <SecondaryCard
      padding="16px"
      margin="0 0 8px"
      onClick={() => onClick && onClick()}
      style={{ cursor: 'pointer' }}
    >
      <HorizontalFlex width={'100%'} justify={'space-between'}>
        <HorizontalFlex align={'center'}>
          {children}
          <VerticalFlex margin={'0 0 0 12px'}>
            <Typography size={14} height="17px" margin={'0 0 4px 0'}>
              {name}
            </Typography>
            <SubTextTypography size={14} height="17px">
              {balanceDisplayValue} {symbol}
            </SubTextTypography>
          </VerticalFlex>
        </HorizontalFlex>
        <HorizontalFlex justify={'flex-end'} align={'center'}>
          {balanceUSD && (
            <Typography weight={600}>
              {currencyFormatter(Number(balanceUSD))} {currency}
            </Typography>
          )}
        </HorizontalFlex>
      </HorizontalFlex>
    </SecondaryCard>
  );
}
