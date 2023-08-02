import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { Divider, Stack, Switch, Typography } from '@avalabs/k2-components';

type ManageTokensListProps = {
  searchQuery: string;
};

export const ManageTokensList = ({ searchQuery }: ManageTokensListProps) => {
  const tokensWithBalances = useTokensWithBalances();

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
