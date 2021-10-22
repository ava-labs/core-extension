import React from 'react';
import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';

export function WalletTokenListItemMiniMode({
  name,
  symbol,
  children,
  balance,
}: {
  name: string;
  symbol: string;
  children: any;
  balance: any;
}) {
  return (
    <HorizontalFlex width="100%" align={'center'}>
      {children}
      <VerticalFlex margin={'0 0 0 8px'}>
        <Typography margin={'0 0 6px 0'}>{name}</Typography>
        <SubTextTypography>
          {balance} ({symbol})
        </SubTextTypography>
      </VerticalFlex>
    </HorizontalFlex>
  );
}
