import React from 'react';
import { HorizontalFlex, Typography } from '@avalabs/react-components';

export function WalletTokenListItem({
  name,
  symbol,
  children,
}: {
  name: string;
  symbol: string;
  children: any;
}) {
  return (
    <HorizontalFlex width="100%">
      {children}
      <Typography margin={'0 8px'}>{name}</Typography>
      <Typography>({symbol})</Typography>
    </HorizontalFlex>
  );
}
