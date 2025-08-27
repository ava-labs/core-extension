import { Box } from '@avalabs/k2-alpine';
import { TokenWithBalance } from '@avalabs/vm-module-types';
import { isTokenMalicious } from '@core/common';
import { useTokensWithBalances } from '@core/ui/src/hooks';
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
  const tokensWithBalances = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
    forceHiddenTokens: true,
  });

  const spamless = useMemo(
    () =>
      spam
        ? tokensWithBalances
        : tokensWithBalances.filter((token) => !isTokenMalicious(token)),
    [spam, tokensWithBalances],
  );

  const filtered = useMemo(
    () =>
      filter
        ? spamless.filter((token) =>
            token.name.toLowerCase().includes(filter.toLowerCase()),
          )
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

const RowRenderer: FC<ListChildComponentProps<TokenWithBalance[]>> = ({
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
