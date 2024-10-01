import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  Divider,
  Stack,
  Switch,
  Typography,
} from '@avalabs/core-k2-components';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { Sort } from './ManageTokens';
import { useMemo } from 'react';

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
  });

  const sortingTokens = useMemo(
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
    [sort]
  );

  return (
    <Stack
      divider={<Divider flexItem sx={{ borderColor: 'grey.800' }} />}
      sx={{ rowGap: '10px' }}
    >
      {tokensWithBalances
        .filter(
          (token) =>
            token.type !== TokenType.NATIVE &&
            (searchQuery.length
              ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
              : true)
        )
        .sort(sortingTokens)
        .map((token) => (
          <ManageTokensListItem
            key={token.type === TokenType.ERC20 ? token.address : token.symbol}
            token={token}
          />
        ))}
    </Stack>
  );
};

type ManageTokensListItemProps = {
  token: TokenWithBalance;
};

const ManageTokensListItem = ({ token }: ManageTokensListItemProps) => {
  const { getTokenVisibility, toggleTokenVisibility } = useSettingsContext();

  return (
    <Stack
      direction="row"
      data-testid={`${token.symbol.toLowerCase()}-token-list-item`}
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: '100%' }}
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
      <Switch
        size="small"
        checked={getTokenVisibility(token)}
        onChange={() => toggleTokenVisibility(token)}
      />
    </Stack>
  );
};
