import { ChainBadge } from '@/components/ChainBadge';
import { Badge, BadgeProps, Stack } from '@avalabs/k2-alpine';
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

const TransactionIcon: FC<Props> = ({ transaction }) => {
  return (
    <Badge
      sx={badgeSx}
      overlap="circular"
      anchorOrigin={anchor}
      badgeContent={
        <ChainBadge coreChainId={Number(transaction.chainId)} size={18} />
      }
    >
      <Stack
        width={32}
        height={32}
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        bgcolor="background.paper"
      >
        <TransactionTypeIcon transaction={transaction} />
      </Stack>
    </Badge>
  );
};

export { TransactionIcon as TransactionIcon };
