import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { Box, Typography, Stack } from '@avalabs/k2-alpine';
import { FungibleTokenBalance } from '@core/types';
import { FC, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useContainerHeight } from '../hooks/useContainerHeight';
import { Divider } from './Divider';
import { TokenListItem } from './TokenListItem';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { isTokenMalicious } from '@core/common';

interface Props {
  filter: string;
  includeSpamTokens: boolean;
}

export const TokenSwitchList: FC<Props> = ({ filter, includeSpamTokens }) => {
  const [height, containerRef] = useContainerHeight<HTMLDivElement>(400);
  const tokensWithBalances = useAllTokensFromEnabledNetworks(true);

  const { t } = useTranslation();
  const filteredTokensList = useMemo(() => {
    const list = filter
      ? tokensWithBalances.filter((token) => {
          const normalizedFilter = filter.toLowerCase();
          return (
            token.name.toLowerCase().includes(normalizedFilter) ||
            token.symbol.toLowerCase().includes(normalizedFilter)
          );
        })
      : tokensWithBalances;

    return includeSpamTokens
      ? list
      : list.filter((token) => !isTokenMalicious(token));
  }, [filter, tokensWithBalances, includeSpamTokens]);

  return (
    <Box height={1} ref={containerRef}>
      {isEmpty(filteredTokensList) && filter ? (
        <Stack
          sx={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h1"
            component="span"
            sx={{ mb: 2, fontWeight: 'medium' }}
          >
            🌵
          </Typography>
          <Typography variant="body3" sx={{ fontWeight: 600 }}>
            {t('No results found')}
          </Typography>
        </Stack>
      ) : (
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
      )}
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
