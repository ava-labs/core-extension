import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  Divider,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import VirtualizedList from '@src/components/common/VirtualizedList';
import { AutoSizer, ListRowRenderer } from 'react-virtualized';
import { useCallback, useMemo } from 'react';

type ManageTokensListProps = {
  searchQuery: string;
};

export const ManageTokensList = ({ searchQuery }: ManageTokensListProps) => {
  const tokensWithBalances = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });

  const filtered = useMemo(
    () =>
      tokensWithBalances.filter(
        (token) =>
          token.type !== TokenType.NATIVE &&
          (searchQuery.length
            ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            : true)
      ),
    [tokensWithBalances, searchQuery]
  );

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, style, isScrolling }) => {
      const token = filtered[index];

      if (token) {
        return (
          <>
            <ManageTokensListItem
              token={token}
              key={
                token.type === TokenType.ERC20 ? token.address : token.symbol
              }
              isScrolling={isScrolling}
              style={style}
              withDivider={index < filtered.length - 1}
            />
          </>
        );
      }
    },
    [filtered]
  );

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <AutoSizer>
        {({ height, width }) => (
          <VirtualizedList
            height={height}
            rowCount={tokensWithBalances.length}
            rowHeight={49}
            rowRenderer={rowRenderer}
            width={width}
          />
        )}
      </AutoSizer>
    </Stack>
  );
};

type ManageTokensListItemProps = {
  token: TokenWithBalance;
  style: any;
  withDivider: boolean;
  isScrolling: boolean;
};

const ManageTokensListItem = ({
  token,
  style,
  withDivider,
  isScrolling,
}: ManageTokensListItemProps) => {
  const { getTokenVisibility, toggleTokenVisibility } = useSettingsContext();

  return (
    <Stack sx={{ width: '100%' }} style={style}>
      <Stack
        direction="row"
        data-testid={`${token.symbol.toLowerCase()}-token-list-item`}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            height: 34,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <TokenIcon
            width="32px"
            height="32px"
            src={isScrolling ? '' : token.logoUri} // don't load images if list is still scrolling
            name={token.name}
          />
          <Stack
            sx={{
              mx: 2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            <Tooltip title={token.name} wrapWithSpan={false}>
              <Typography
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {token.name}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {token.balanceDisplayValue !== '0'
                ? `${token.balanceDisplayValue} ${token.symbol}`
                : ' '}
            </Typography>
          </Stack>
        </Stack>
        <Switch
          size="small"
          checked={getTokenVisibility(token)}
          onChange={() => toggleTokenVisibility(token)}
        />
      </Stack>
      {withDivider && (
        <Divider flexItem sx={{ my: 1, borderColor: 'grey.800' }} />
      )}
    </Stack>
  );
};
