import {
  Box,
  IconButton,
  OutboundIcon,
  Skeleton,
  Stack,
  Tooltip,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';
import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import {
  getAvalancheAddressLink,
  openNewTab,
  stripAddressPrefix,
} from '@core/common';
import { TokenWithBalance } from '@avalabs/vm-module-types';

import { Section, SectionRow } from '@/pages/Onboarding/components/Section';

import { useNativeBalanceFetcher } from '@core/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type AccountInfo = {
  address: string;
  xpAddress?: string;
};

type CommonProps = {
  chainCaipId: string;
  addLoadingRow?: boolean;
};

type DerivedAddressesProps = CommonProps &
  (
    | { addresses: string[]; accounts?: never }
    | { accounts: AccountInfo[]; addresses?: never }
  );

type AccountBalanceInfo = {
  isLoading: boolean;
  totalDisplayValue?: string;
  symbol?: string;
};

type AccountBalanceMap = Map<string, AccountBalanceInfo>;

function sumBalances(balances: (TokenWithBalance | undefined)[]): {
  totalDisplayValue: string;
  symbol: string;
} | null {
  const validBalances = balances.filter(
    (b): b is TokenWithBalance => b !== undefined,
  );

  if (validBalances.length === 0) {
    return null;
  }

  const total = validBalances.reduce(
    (sum, b) => sum + parseFloat(b.balanceDisplayValue),
    0,
  );

  return {
    totalDisplayValue:
      total % 1 === 0 ? total.toString() : total.toFixed(4).replace(/0+$/, ''),
    symbol: validBalances[0]?.symbol ?? 'AVAX',
  };
}

export const DerivedAddresses = ({
  accounts: accountsProp,
  addresses,
  chainCaipId,
  addLoadingRow = false,
}: DerivedAddressesProps) => {
  const accounts = useMemo(
    () =>
      accountsProp ?? addresses.map((address): AccountInfo => ({ address })),
    [accountsProp, addresses],
  );

  const { fetchBalance: fetchCBalance } = useNativeBalanceFetcher(chainCaipId);
  const { fetchBalance: fetchXBalance } = useNativeBalanceFetcher(
    AvalancheCaip2ChainId.X,
  );
  const { fetchBalance: fetchPBalance } = useNativeBalanceFetcher(
    AvalancheCaip2ChainId.P,
  );

  const hasXPAddresses = accounts.some((a) => a.xpAddress);

  const [balances, setBalances] = useState<AccountBalanceMap>(
    () => new Map(accounts.map((a) => [a.address, { isLoading: true }])),
  );

  const fetchAllBalances = useCallback(
    async (accountsToFetch: AccountInfo[]) => {
      const requests = accountsToFetch.map(async (account) => {
        try {
          const cBalance = await fetchCBalance(account.address).catch(
            () => undefined,
          );

          let xBalance: TokenWithBalance | undefined;
          let pBalance: TokenWithBalance | undefined;

          if (account.xpAddress) {
            [xBalance, pBalance] = await Promise.all([
              fetchXBalance(account.xpAddress).catch(() => undefined),
              fetchPBalance(account.xpAddress).catch(() => undefined),
            ]);
          }

          const result = sumBalances([cBalance, xBalance, pBalance]);

          setBalances((prev) =>
            new Map(prev).set(account.address, {
              isLoading: false,
              totalDisplayValue: result?.totalDisplayValue,
              symbol: result?.symbol,
            }),
          );
        } catch {
          setBalances((prev) =>
            new Map(prev).set(account.address, { isLoading: false }),
          );
        }
      });
      await Promise.allSettled(requests);
    },
    [fetchCBalance, fetchXBalance, fetchPBalance],
  );

  useEffect(() => {
    fetchAllBalances(accounts);
  }, [fetchAllBalances, accounts]);

  const sortedAccounts = accounts.map((account, index) => ({
    account,
    index,
    balance: balances.get(account.address) ?? { isLoading: true },
  }));

  return (
    <Section>
      {sortedAccounts.map(({ account, index, balance }) => (
        <SectionRow key={account.address} gap="unset" py={0.25}>
          <Stack direction="row" gap={1.5} alignItems="center" minWidth={0}>
            <Typography variant="subtitle1" color="text.secondary" width={10}>
              {index + 1}
            </Typography>
            <Stack minWidth={0}>
              <Tooltip title={account.address}>
                <Typography
                  variant="subtitle1"
                  fontFamily="monospace"
                  color="text.primary"
                  noWrap
                >
                  {truncateAddress(account.address, 14)}
                </Typography>
              </Tooltip>
              {hasXPAddresses && account.xpAddress && (
                <Tooltip title={stripAddressPrefix(account.xpAddress)}>
                  <Typography
                    variant="caption"
                    fontFamily="monospace"
                    color="text.secondary"
                    noWrap
                  >
                    {truncateAddress(stripAddressPrefix(account.xpAddress), 14)}
                  </Typography>
                </Tooltip>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" gap={1.5} alignItems="center" flexShrink={0}>
            {balance.isLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              balance.totalDisplayValue && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Typography variant="subtitle1">
                    {balance.totalDisplayValue}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {balance.symbol}
                  </Typography>
                </Stack>
              )
            )}
            <IconButton
              onClick={() => {
                openNewTab({ url: getAvalancheAddressLink(account.address) });
              }}
            >
              <OutboundIcon />
            </IconButton>
          </Stack>
        </SectionRow>
      ))}
      {addLoadingRow && (
        <SectionRow
          sx={{
            gap: 'unset',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.25,
          }}
        >
          <Stack direction="row" gap={1.5} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {sortedAccounts.length + 1}
            </Typography>
            <Skeleton variant="text" width="150px" animation="wave" />
          </Stack>
          <Stack direction="row" gap={1.5} alignItems="center">
            <Skeleton variant="text" width="100px" animation="wave" />
            <Box width={32}>
              <Skeleton variant="circular" width="24px" height="24px" />
            </Box>
          </Stack>
        </SectionRow>
      )}
    </Section>
  );
};
