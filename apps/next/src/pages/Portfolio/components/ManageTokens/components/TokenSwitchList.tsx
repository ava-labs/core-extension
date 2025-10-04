import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { Box } from '@avalabs/k2-alpine';
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
  const tokensWithBalances = useAllTokensFromEnabledNetworks(false, !spam);

  const filteredTokensList = useMemo(
    () =>
      filter
        ? tokensWithBalances.filter((token) => {
            const normalizedFilter = filter.toLowerCase();
            return (
              token.name.toLowerCase().includes(normalizedFilter) ||
              token.symbol.toLowerCase().includes(normalizedFilter)
            );
          })
        : tokensWithBalances,
    [filter, tokensWithBalances],
  );

  return (
    <Box height={1} ref={containerRef}>
      <FixedSizeList
        height={height}
        width="100%"
        itemData={filteredTokensList}
        itemCount={filteredTokensList.length}
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
