import { TokenAvatar } from '@/components/TokenAvatar';
import { bigintToBig, bigToLocaleString } from '@avalabs/core-utils-sdk';
import { Typography } from '@avalabs/k2-alpine';
import { FungibleTokenBalance } from '@core/types';
import { useSettingsContext } from '@core/ui';
import Big from 'big.js';
import { FC } from 'react';
import { BridgeTokenCardLayout } from './components/Layout';
import { BridgeTokenCardSkeleton } from './components/Skeleton';

type Props = {
  token: FungibleTokenBalance | undefined;
  amount: Big | bigint;
  size: number;
  badgeSize: number;
};

export const BridgeTokenCard: FC<Props> = ({
  amount,
  token,
  size,
  badgeSize,
}) => {
  const { currencyFormatter } = useSettingsContext();

  if (!token) {
    return <BridgeTokenCardSkeleton />;
  }

  const amountBig =
    typeof amount === 'bigint' ? bigintToBig(amount, token.decimals) : amount;

  return (
    <BridgeTokenCardLayout
      avatar={<TokenAvatar token={token} size={size} badgeSize={badgeSize} />}
      name={
        <Typography variant="subtitle3" color="text.primary">
          {token.name}
        </Typography>
      }
      amount={
        <Typography variant="h3" color="text.primary">
          {bigToLocaleString(amountBig)}
        </Typography>
      }
      price={
        <Typography variant="caption" color="text.secondary">
          {currencyFormatter(
            amountBig.mul(token.priceInCurrency ?? 0).toNumber(),
          )}
        </Typography>
      }
    />
  );
};
