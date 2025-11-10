import { Stack, Typography } from '@avalabs/core-k2-components';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenWithBalanceBTC } from '@avalabs/vm-module-types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  token: TokenWithBalanceBTC;
};

export const BTCBalanceBreakdown: FC<Props> = ({ token }) => {
  const { t } = useTranslation();

  const confirmed = new TokenUnit(token.balance, token.decimals, token.symbol);
  const unconfirmed = new TokenUnit(
    token.unconfirmedBalance ?? 0n,
    token.decimals,
    token.symbol,
  );

  const rows = [
    {
      label: t('Confirmed'),
      value: confirmed.toDisplay(),
    },
    {
      label: t('Unconfirmed'),
      value: unconfirmed.toDisplay(),
    },
    {
      label: t('Total Balance'),
      value: confirmed.add(unconfirmed).toDisplay(),
    },
  ];

  return (
    <Stack rowGap={1} direction="column">
      {rows.map(({ label, value }) => (
        <Stack
          key={label}
          direction="row"
          justifyContent="space-between"
          columnGap={2}
        >
          <Typography variant="caption" fontWeight={600}>
            {label}
          </Typography>
          <Typography variant="caption" align="right">
            {value} {token.symbol}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
