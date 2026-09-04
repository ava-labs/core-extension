import { useAllTokensFromEnabledNetworks } from '@/hooks/useAllTokensFromEnabledNetworks';
import { useNetworkTokensSearch } from '@/hooks/useNetworkTokensSearch';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Stack,
} from '@avalabs/k2-alpine';
import { FungibleTokenBalance } from '@core/types';
import { FC, ReactNode, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useContainerHeight } from '../hooks/useContainerHeight';
import { Divider } from './Divider';
import { TokenListItem } from './TokenListItem';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { isTokenMalicious } from '@core/common';
import { TokenType } from '@avalabs/vm-module-types';

interface Props {
  filter: string;
  includeSpamTokens: boolean;
  onlyTokensWithBalance: boolean;
}

const filterByQuery = (tokens: FungibleTokenBalance[], filter: string) => {
  if (!filter) {
    return tokens;
  }
  const normalizedFilter = filter.toLowerCase();
  return tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(normalizedFilter) ||
      token.symbol.toLowerCase().includes(normalizedFilter) ||
      (token.type === TokenType.ERC20 &&
        token.address.toLowerCase().includes(normalizedFilter)),
  );
};

export const TokenSwitchList: FC<Props> = (props) =>
  props.onlyTokensWithBalance ? (
    <HeldTokensList {...props} />
  ) : (
    <CatalogTokensList {...props} />
  );

const HeldTokensList: FC<Props> = ({ filter, includeSpamTokens }) => {
  const visibleTokens = useAllTokensFromEnabledNetworks(true);

  const filteredTokensList = useMemo(() => {
    const list = filterByQuery(visibleTokens, filter);
    return includeSpamTokens
      ? list
      : list.filter((token) => !isTokenMalicious(token));
  }, [filter, visibleTokens, includeSpamTokens]);

  return <TokenList tokens={filteredTokensList} hasFilter={Boolean(filter)} />;
};

const CatalogTokensList: FC<Props> = ({ filter, includeSpamTokens }) => {
  const { tokens, loadMore, isLoading, isFetchingNextPage, isError, refetch } =
    useNetworkTokensSearch({ includeSpamTokens, keyword: filter });

  return (
    <TokenList
      tokens={tokens}
      hasFilter={Boolean(filter)}
      isLoading={isLoading}
      isLoadingMore={isFetchingNextPage}
      isError={isError}
      onRetry={() => refetch()}
      onEndReached={loadMore}
    />
  );
};

interface TokenListProps {
  tokens: FungibleTokenBalance[];
  hasFilter: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEndReached?: () => void;
}

const TokenList: FC<TokenListProps> = ({
  tokens,
  hasFilter,
  isLoading,
  isLoadingMore,
  isError,
  onRetry,
  onEndReached,
}) => {
  const [height, containerRef] = useContainerHeight<HTMLDivElement>(400);
  const { t } = useTranslation();

  // Also show the footer loader when the first page is still resolving but
  // held/custom tokens are already listed, so the wait stays visible.
  const showFooterLoader = Boolean(
    isLoadingMore || (isLoading && !isEmpty(tokens)),
  );

  return (
    <Box height={1} ref={containerRef}>
      {isEmpty(tokens) ? (
        isLoading ? (
          <CenteredState>
            <CircularProgress size={24} />
          </CenteredState>
        ) : isError ? (
          <CenteredState>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('Something went wrong loading tokens.')}
            </Typography>
            {onRetry ? (
              <Button size="small" variant="outlined" onClick={onRetry}>
                {t('Try again')}
              </Button>
            ) : null}
          </CenteredState>
        ) : hasFilter ? (
          <CenteredState>
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
          </CenteredState>
        ) : null
      ) : (
        <FixedSizeList
          height={height}
          width="100%"
          itemData={tokens}
          itemCount={tokens.length + (showFooterLoader ? 1 : 0)}
          itemSize={54}
          overscanCount={5}
          style={{ overflow: 'auto', scrollbarWidth: 'none' }}
          onItemsRendered={
            onEndReached
              ? ({ visibleStopIndex }) => {
                  if (visibleStopIndex >= tokens.length - 5) {
                    onEndReached();
                  }
                }
              : undefined
          }
        >
          {RowRenderer}
        </FixedSizeList>
      )}
    </Box>
  );
};

const CenteredState: FC<{ children: ReactNode }> = ({ children }) => (
  <Stack
    sx={{
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    }}
  >
    {children}
  </Stack>
);

const RowRenderer: FC<ListChildComponentProps<FungibleTokenBalance[]>> = ({
  index,
  data,
  style,
}) => {
  const token = data[index];

  if (!token) {
    return (
      <div style={style}>
        <Stack
          sx={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={20} />
        </Stack>
      </div>
    );
  }

  return (
    <div style={style}>
      <Divider first={index === 0} />
      <TokenListItem token={token} />
    </div>
  );
};
