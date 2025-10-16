import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { Box } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { isTokenMalicious } from '@core/common';
import { FungibleTokenBalance } from '@core/types';
import { FC, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useContainerHeight } from '../hooks/useContainerHeight';
import { Divider } from './Divider';
import { TokenListItem } from './TokenListItem';

interface Props {
  filter: string;
  spam: boolean;
}

export const TokenSwitchList: FC<Props> = ({ filter, spam }) => {
  const [height, containerRef] = useContainerHeight<HTMLDivElement>(400);
  const tokensWithBalances = useAllTokensFromEnabledNetworks();

  const nonNative = useMemo(() => {
    return tokensWithBalances.filter(
      (token) => token.type !== TokenType.NATIVE,
    );
  }, [tokensWithBalances]);

  const spamless = useMemo(
    () =>
      spam ? nonNative : nonNative.filter((token) => !isTokenMalicious(token)),
    [spam, nonNative],
  );

  const filtered = useMemo(
    () =>
      filter
        ? spamless.filter((token) => {
            const normalizedFilter = filter.toLowerCase();
            return (
              token.name.toLowerCase().includes(normalizedFilter) ||
              token.symbol.toLowerCase().includes(normalizedFilter)
            );
          })
        : spamless,
    [filter, spamless],
  );

  return (
    <Box height={1} ref={containerRef}>
      <FixedSizeList
        height={height}
        width="100%"
        itemData={filtered}
        itemCount={filtered.length}
        itemSize={54}
        overscanCount={5}
        style={{ overflow: 'auto', scrollbarWidth: 'none' }}
      >
        {RowRenderer}
      </FixedSizeList>
    </Box>
  );
};

const RowRenderer: FC<ListChildComponentProps<FungibleTokenBalance[]>> = ({
  index,
  data,
  style,
}) => {
  return (
    <div style={style}>
      <Divider first={index === 0} />
      <TokenListItem token={data[index]!} />
    </div>
  );
};
