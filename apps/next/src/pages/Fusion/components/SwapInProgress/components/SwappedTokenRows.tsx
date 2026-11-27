import { FC } from 'react';
import { Box, Stack } from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { TokenAmountInfo } from '../hooks/useSwappedTokens';

import * as Styled from './Styled';
import { TokemAmountInfoBox } from './TokemAmountInfoBox';
import { TokenAmountInfoSkeleton } from './TokemAmountInfoBox/components';

type Props = {
  tokens: TokenAmountInfo[];
  isPending: boolean;
};

const EXPECTED_ROWS: TokenAmountInfo['type'][] = ['paid', 'received'];

export const SwappedTokenRows: FC<Props> = ({ tokens, isPending }) => {
  const missingRows = isPending
    ? EXPECTED_ROWS.filter((type) => !tokens.some((row) => row.type === type))
    : [];

  return (
    <Card noPadding>
      <Stack divider={<Styled.Divider />}>
        {tokens.map(({ token, amount, tokenId, type }) => (
          <Box
            key={tokenId}
            data-testid={`fusion-transfer-summary-row-${type}`}
            data-token-symbol={token?.symbol}
            data-token-chain-id={token?.coreChainId}
          >
            <TokemAmountInfoBox
              token={token}
              amount={type === 'paid' ? -amount : amount}
              size={24}
              badgeSize={14}
            />
          </Box>
        ))}
        {missingRows.map((type) => (
          <Box
            key={type}
            data-testid={`fusion-transfer-summary-skeleton-${type}`}
          >
            <TokenAmountInfoSkeleton />
          </Box>
        ))}
      </Stack>
    </Card>
  );
};
