import { Stack, Tooltip, Typography } from '@avalabs/core-k2-components';
import { isNftTokenType } from '@core/common';
import { TxHistoryItem } from '@core/types';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { ActivityCardProp } from './ActivityCard';
import { TransactionType } from '@avalabs/vm-module-types';
import { TruncateFeeAmount } from '@/components/common/TruncateFeeAmount';

export function ActivityCardAmount({ historyItem }: ActivityCardProp) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  function getSourceToken(tx: TxHistoryItem) {
    const userAddress = activeAccount?.addressC;
    if (!userAddress) {
      return undefined;
    }
    return tx.tokens.find((token) => token.from?.address === userAddress);
  }

  function getTargetToken(tx: TxHistoryItem) {
    const userAddress = activeAccount?.addressC;
    if (!userAddress) {
      return undefined;
    }
    return tx.tokens.find((token) => token.to?.address === userAddress);
  }

  if (historyItem.txType === TransactionType.SWAP && activeAccount?.addressC) {
    const source = getSourceToken(historyItem);
    const target = getTargetToken(historyItem);
    return (
      <Stack sx={{ flexDirection: 'row', columnGap: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>
          {source?.amount}
        </Typography>
        <Typography
          variant="body2"
          sx={(theme) => ({ color: theme.palette.primary.dark })}
        >
          {source?.symbol} -&gt;
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>
          {target?.amount}
        </Typography>
        <Typography
          variant="body2"
          sx={(theme) => ({ color: theme.palette.primary.dark })}
        >
          {target?.symbol}
        </Typography>
      </Stack>
    );
  } else if (
    historyItem.tokens[0] &&
    isNftTokenType(historyItem.tokens[0]?.type)
  ) {
    return (
      <Typography>#{historyItem.tokens?.[0]?.collectableTokenId}</Typography>
    );
  }

  const amount = historyItem.tokens?.[0]?.amount;
  const symbol = historyItem.tokens?.[0]?.symbol;
  return (
    <Stack sx={{ flexDirection: 'row', columnGap: 0.5 }}>
      {amount && (
        <Tooltip title={amount}>
          <TruncateFeeAmount amount={amount} />
        </Tooltip>
      )}
      <Typography
        variant="body2"
        sx={(theme) => ({ color: theme.palette.primary.dark })}
      >
        {symbol}
      </Typography>
    </Stack>
  );
}
