import { Stack, Typography } from '@avalabs/core-k2-components';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenWithBalance } from '@avalabs/vm-module-types';
import { hasUnconfirmedBalance } from '@core/common';
import { FC } from 'react';

type Props = {
  token: TokenWithBalance;
};

export const TokenBalance: FC<Props> = ({ token }) => {
  const totalBalance = hasUnconfirmedBalance(token)
    ? new TokenUnit(
        token.balance + token.unconfirmedBalance,
        token.decimals,
        token.symbol,
      )
    : new TokenUnit(
        token.balance,
        'decimals' in token ? token.decimals : 0,
        token.symbol,
      );

  return (
    <Stack
      direction="row"
      alignItems="center"
      columnGap={0.5}
      sx={{ cursor: 'pointer' }}
    >
      <Typography data-testid="token-details-balance" variant="body2">
        {totalBalance.toDisplay()}{' '}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {token.symbol}
      </Typography>
    </Stack>
  );
};
