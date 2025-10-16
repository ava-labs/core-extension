import { useCallback, useMemo } from 'react';
import {
  Divider,
  Stack,
  Switch,
  Typography,
} from '@avalabs/core-k2-components';
import { AutoSizer } from 'react-virtualized';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';

import VirtualizedList from '@/components/common/VirtualizedList';
import { useNetworkContext, useTokensWithBalances } from '@core/ui';
import { TokenIcon } from '@/components/common/TokenIcon';
import { useSettingsContext } from '@core/ui';
import { isTokenMalicious } from '@core/common';
import { MaliciousTokenWarningIcon } from '@/components/common/MaliciousTokenWarning';

import { Sort } from './ManageTokens';

type ManageTokensListProps = {
  searchQuery: string;
  sort?: string;
};

export const ManageTokensList = ({
  searchQuery,
  sort,
}: ManageTokensListProps) => {
  const tokensWithBalances = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
    forceHiddenTokens: true,
  });

  const tokenSorter = useMemo(
    () => (a, b) => {
      if (sort === Sort.NAME) {
        return b.name - a.name;
      }
      if (sort === Sort.BALANCE) {
        return (
          (parseFloat(b.balanceCurrencyDisplayValue) || 0) -
          (parseFloat(a.balanceCurrencyDisplayValue) || 0)
        );
      }
      return (
        (parseFloat(b.balanceDisplayValue) || 0) -
        (parseFloat(a.balanceDisplayValue) || 0)
      );
    },
    [sort],
  );

  const tokenList = useMemo(
    () =>
      tokensWithBalances
        .filter(
          (token) =>
            token.type !== TokenType.NATIVE &&
            (searchQuery.length
              ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
              : true),
        )
        .sort(tokenSorter),
    [tokensWithBalances, searchQuery, tokenSorter],
  );

  const rowRenderer = useCallback(
    ({ index, style }) => {
      const token = tokenList[index];
      if (!token) {
        // Token should be truthy and should not get here. Just adding this to not break the list if this happens. This will make the row just empty.
        return <div style={style}></div>;
      }

      return <ManageTokensListItem token={token} style={style} />;
    },
    [tokenList],
  );

  return (
    <Stack
      divider={<Divider flexItem sx={{ borderColor: 'grey.800' }} />}
      sx={{ rowGap: '10px', flexGrow: 1 }}
    >
      <AutoSizer>
        {({ height, width }) => (
          <VirtualizedList
            height={height}
            itemCount={tokenList.length}
            itemSize={56}
            width={width}
          >
            {rowRenderer}
          </VirtualizedList>
        )}
      </AutoSizer>
    </Stack>
  );
};

type ManageTokensListItemProps = {
  token: TokenWithBalance;
  style: React.CSSProperties;
};

const ManageTokensListItem = ({ token, style }: ManageTokensListItemProps) => {
  const { getTokenVisibility, toggleTokenVisibility } = useSettingsContext();
  const { network } = useNetworkContext();

  return (
    <Stack
      direction="row"
      data-testid={`${(token.type !== TokenType.NATIVE ? token.address : token.symbol).toLowerCase()}-token-list-item`}
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: '100%', py: 1 }}
      style={style}
    >
      <Stack direction="row" alignItems="center">
        <TokenIcon
          width="32px"
          height="32px"
          src={token.logoUri}
          name={token.name}
        />
        <Stack sx={{ mx: 2 }}>
          <Typography sx={{ mb: 0.5 }}>{token.name}</Typography>
          <Typography>{token.balanceDisplayValue}</Typography>
        </Stack>
      </Stack>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        {isTokenMalicious(token) && <MaliciousTokenWarningIcon size={16} />}
        <Switch
          size="small"
          checked={getTokenVisibility(token, network?.caipId)}
          onChange={() =>
            network && toggleTokenVisibility(token, network.caipId)
          }
        />
      </Stack>
    </Stack>
  );
};
