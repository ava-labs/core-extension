import Big from 'big.js';
import { FC } from 'react';
import { Typography } from '@avalabs/k2-alpine';
import { bigintToBig, bigToLocaleString } from '@avalabs/core-utils-sdk';

import { useSettingsContext } from '@core/ui';
import { FungibleTokenBalance } from '@core/types';

import { TokenAvatar } from '@/components/TokenAvatar';

import { TokenAmountInfoLayout, TokenAmountInfoSkeleton } from './components';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

type Props = {
  token: FungibleTokenBalance | undefined;
  amount: Big | bigint;
  size: number;
  badgeSize: number;
};

export const TokemAmountInfoBox: FC<Props> = ({
  amount,
  token,
  size,
  badgeSize,
}) => {
  const { currencyFormatter } = useSettingsContext();

  if (!token) {
    return <TokenAmountInfoSkeleton />;
  }

  const amountBig =
    typeof amount === 'bigint' ? bigintToBig(amount, token.decimals) : amount;
  const isNegative = amountBig.lt(0);

  return (
    <TokenAmountInfoLayout
      avatar={<TokenAvatar token={token} size={size} badgeSize={badgeSize} />}
      name={
        <Typography variant="subtitle3" color="text.primary">
          {token.name}
        </Typography>
      }
      amount={
        <CollapsedTokenAmount
          amount={bigToLocaleString(amountBig, token.decimals)}
          regularProps={{
            variant: 'h3',
            sx: {
              color: isNegative ? 'error.main' : 'text.primary',
            },
          }}
          overlineProps={{
            variant: 'caption2',
            sx: {
              color: isNegative ? 'error.main' : 'text.secondary',
            },
          }}
          showApproximationSign={false}
        />
      }
      price={
        <Typography
          variant="caption"
          color={isNegative ? 'error.light' : 'text.secondary'}
        >
          {currencyFormatter(
            amountBig.mul(token.priceInCurrency ?? 0).toNumber(),
          )}
        </Typography>
      }
    />
  );
};
