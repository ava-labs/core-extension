import {
  Avatar,
  Divider,
  IconButton,
  MenuItem,
  SearchInput,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';

import {
  useAccountsContext,
  useBalancesContext,
  useLiveBalance,
  useTokensWithBalances,
} from '@core/ui';

import { Card } from '@/components/Card';
import { Account } from '@core/types';
import { getAllAddressesForAccount } from '@core/common';
import { pick } from 'lodash';

type TokenFieldProps = {
  value?: string;
  onChange: (tokenIdentifier: string) => void;
  accountId: Account['id'];
};
const TOKEN_TYPES = [TokenType.NATIVE, TokenType.ERC20];

const useTokensForAccount = (accountId: Account['id']) => {
  const { getAccountById } = useAccountsContext();
  const {
    balances: { tokens },
  } = useBalancesContext();

  const account = getAccountById(accountId);
  if (!account) {
    return [];
  }

  const addresses = getAllAddressesForAccount(account);

  return Object.values(
    Object.entries(tokens ?? {})
      .map(([_, chainBalances]) => pick(chainBalances, addresses))
      .flatMap((b) =>
        Object.values(b)
          .map((b2) => Object.values(b2))
          .flat(),
      ),
  ).flat();
};

export const TokenField: FC<TokenFieldProps> = ({
  value,
  onChange,
  accountId,
}) => {
  useLiveBalance(TOKEN_TYPES);

  const tokens = useTokensForAccount(accountId);

  // Select appropriate tokens based on the from account
  return (
    <Card>
      <TokenSelect
        label="Token"
        tokenIdentifier={value}
        tokenList={tokens}
        onChange={onChange}
      />
    </Card>
  );
};

type TokenSelectProps = {
  label: string;
  tokenIdentifier?: string;
  tokenList: TokenWithBalance[];
  onChange: (tokenIdentifier: string) => void;
};
const TokenSelect: FC<TokenSelectProps> = ({
  label,
  tokenIdentifier,
  tokenList,
  onChange,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const selectedToken = tokenList.find((token) =>
    token.type === TokenType.NATIVE
      ? token.symbol === tokenIdentifier
      : token.address === tokenIdentifier,
  );

  return (
    <Select
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      displayEmpty
      sx={{ columnGap: 0, minWidth: 'unset' }}
      IconComponent={() =>
        selectedToken ? null : (
          <MdKeyboardArrowRight
            color={theme.palette.text.secondary}
            style={{
              width: '24px',
              height: '24px',
              minWidth: '24px',
              minHeight: '24px',
              marginRight: '-8px',
            }}
          />
        )
      }
      label={label ?? ''}
      value={tokenIdentifier}
      renderValue={() =>
        selectedToken ? (
          <Stack
            direction="row"
            alignItems="center"
            sx={{ columnGap: ({ spacing }) => spacing(0.5) }}
            onClick={() => setOpen(!open)}
          >
            <IconButton>
              {/* TODO: add chain badge */}
              <Avatar src={selectedToken.logoUri} alt={selectedToken.symbol} />
            </IconButton>
            <Stack>
              <Typography variant="body3" sx={{ textWrap: 'nowrap' }}>
                {label}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ columnGap: ({ spacing }) => spacing(0.5) }}
              >
                <Typography variant="h4">{selectedToken.symbol}</Typography>
                {!!tokenList.length && (
                  <MdKeyboardArrowDown
                    size={20}
                    color={theme.palette.text.primary}
                  />
                )}
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', textWrap: 'nowrap' }}
              >
                {selectedToken.balanceDisplayValue}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            width="100%"
          >
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                borderRadius: 1,
                transition: 'background-color 175ms ease',
              }}
            >
              {t('Select')}
            </Typography>
          </Stack>
        )
      }
    >
      <Stack pt={0.5}>
        <SearchInput autoFocus onClick={(e) => e.stopPropagation()} />
        <Divider sx={{ mb: 1 }} />
        {tokenList.map((token) => (
          <MenuItem
            key={token.type === TokenType.NATIVE ? token.symbol : token.address}
            onClick={() =>
              onChange(
                token.type === TokenType.NATIVE ? token.symbol : token.address,
              )
            }
          >
            <Typography variant="body3">{token.symbol}</Typography>
          </MenuItem>
        ))}
      </Stack>
    </Select>
  );
};
