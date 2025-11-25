import { useParams } from 'react-router-dom';
import { AssetsErrorState } from '../AssetsErrorState';
import { Box, Slide, Stack, Typography } from '@avalabs/k2-alpine';
import { Suspense, useMemo, useState } from 'react';
import { PortfolioActionButtons } from '../PortfolioActionButtons';
import { TokenAvatar } from '@/components/TokenAvatar';
import { useTokenHistory } from './hooks/useTokenHistory';
import { ActivityFilter } from '../ActivityTab/types';
import { useUrlState } from './hooks/useUrlState';
import { useTokenDetails } from './hooks/useTokenDetails';
import { ActivityFilterSelector } from '../ActivityTab/components/ActivityFilterSelector';
import { TransactionListSkeleton } from '../ActivityTab/components/TransactionList';
import { HistoryList } from '../ActivityTab/components/TransactionList/components/HistoryList';

export const TokenDetails = () => {
  const { networkId, tokenAddress } = useParams<{
    networkId: string;
    tokenAddress: string;
  }>();

  const preppedNetworkId = useMemo(() => Number(networkId), [networkId]);

  const { token, tokenBalance, tokenBalanceInCurrency, currency } =
    useTokenDetails({ networkId, tokenAddress });
  const transactionHistory = useTokenHistory({
    networkId: preppedNetworkId,
    tokenAddress,
  });
  const urlState = useUrlState();

  const [filter, setFilter] = useState<ActivityFilter>(
    urlState.filter ?? 'All',
  );

  if (!token || !tokenBalance) {
    return <AssetsErrorState />;
  }

  return (
    <Stack mt={4.5} mx={1.5}>
      <Box flexShrink={0}>
        <TokenAvatar token={token} size={32} badgeSize={16} />
      </Box>
      <Typography variant="h2" color="text.secondary">
        {token.name}
      </Typography>
      <Stack
        direction="row"
        alignItems="flex-end"
        gap={0.5}
        color="text.primary"
      >
        <Typography variant="h2">{tokenBalance.balanceDisplayValue}</Typography>
        <Typography variant="h7">{token.symbol}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" gap={0.5} my={0.5}>
        <Typography variant="body1" fontWeight={500} color="text.primary">
          {tokenBalanceInCurrency} {currency}
        </Typography>
      </Stack>
      <PortfolioActionButtons />

      <Stack direction="row" gap={1.25} mt={3} mb={2}>
        <Slide direction="right" in>
          <ActivityFilterSelector
            selected={filter}
            exclude={['NFTs']}
            onChange={(newFilter) => {
              setFilter(newFilter);
              urlState.update(newFilter, preppedNetworkId, tokenAddress);
            }}
          />
        </Slide>
      </Stack>
      <Suspense fallback={<TransactionListSkeleton />}>
        <HistoryList filter={filter} transactionHistory={transactionHistory} />
      </Suspense>
    </Stack>
  );
};
