import { ChainBadge } from '@/components/ChainBadge';
import { hyperliquidCoinSvgUrl } from '@avalabs/hypercore-module';
import { Badge, BadgeProps, Stack } from '@avalabs/k2-alpine';
import { caipToChainId, HYPERCORE_CHAIN_ID } from '@core/common';
import { TxHistoryItem } from '@core/types';
import { FC } from 'react';
import { TransactionTypeIcon } from './components/TransactionTypeIcon';

export interface Props {
  transaction: TxHistoryItem;
}

const badgeSx: BadgeProps['sx'] = { isolation: 'isolate' };
const anchor: BadgeProps['anchorOrigin'] = {
  vertical: 'bottom',
  horizontal: 'right',
};

const resolveCoreChainId = (chainId: string) => {
  if (chainId.includes(':')) {
    try {
      return caipToChainId(chainId);
    } catch {
      return Number.NaN;
    }
  }
  return Number(chainId);
};

const TransactionIcon: FC<Props> = ({ transaction }) => {
  const coreChainId = resolveCoreChainId(transaction.chainId);
  const [token] = transaction.tokens;
  const isHypercore =
    Number.isFinite(coreChainId) && coreChainId === HYPERCORE_CHAIN_ID;
  const hypercoreCoin = isHypercore
    ? (token?.name ?? token?.symbol)
    : undefined;

  return (
    <Badge
      sx={badgeSx}
      overlap="circular"
      anchorOrigin={anchor}
      badgeContent={
        Number.isFinite(coreChainId) ? (
          <ChainBadge coreChainId={coreChainId} size={18} />
        ) : undefined
      }
    >
      <Stack
        width={32}
        height={32}
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        bgcolor="background.paper"
        overflow="hidden"
      >
        {hypercoreCoin ? (
          <img
            src={hyperliquidCoinSvgUrl(hypercoreCoin)}
            alt=""
            width={32}
            height={32}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <TransactionTypeIcon transaction={transaction} />
        )}
      </Stack>
    </Badge>
  );
};

export { TransactionIcon as TransactionIcon };
