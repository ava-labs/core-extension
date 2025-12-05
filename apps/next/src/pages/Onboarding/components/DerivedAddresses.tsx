import {
  IconButton,
  OutboundIcon,
  Skeleton,
  Stack,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';
import { getAvalancheAddressLink, openNewTab } from '@core/common';
import { TokenWithBalance } from '@avalabs/vm-module-types';

import { Section, SectionRow } from '@/pages/Onboarding/components/Section';

import { useNativeBalanceFetcher } from '@core/ui';
import { useCallback, useEffect, useState } from 'react';

type DerivedAddressesProps = {
  addresses: string[];
  chainCaipId: string;
};

type BalanceInfo = {
  isLoading: boolean;
  balance?: TokenWithBalance;
};

type BalanceInfoMap = Map<string, BalanceInfo>;

export const DerivedAddresses = ({
  addresses,
  chainCaipId,
}: DerivedAddressesProps) => {
  const { fetchBalance } = useNativeBalanceFetcher(chainCaipId);

  const [balances, setBalances] = useState<BalanceInfoMap>(() =>
    initialBalanceInfoMap(addresses),
  );

  const fetchBalances = useCallback(
    async (addressesToFetch: string[]) => {
      const requests = addressesToFetch.map((address) =>
        fetchBalance(address)
          .then((balance) => {
            setBalances((prev) => updateMap(prev, address, balance));
          })
          .catch(() => {
            // If we can't fetch the balance, we simply won't show it.
            console.warn(`Failed to fetch balance for address ${address}`);
            setBalances((prev) => updateMap(prev, address, undefined));
          }),
      );
      await Promise.allSettled(requests);
    },
    [fetchBalance],
  );

  useEffect(() => {
    fetchBalances(addresses);
  }, [fetchBalances, addresses]);

  const sortedAddresses = balances
    .entries()
    .toArray()
    .toSorted(
      ([addressA], [addressB]) =>
        addresses.indexOf(addressA) - addresses.indexOf(addressB),
    );

  return (
    <Section>
      {sortedAddresses.map(([address, { isLoading, balance }], index) => (
        <SectionRow key={address} gap="unset" py={0.25}>
          <Stack direction="row" gap={1.5} alignItems="center">
            <Typography variant="subtitle1" color="text.secondary" width={10}>
              {index + 1}
            </Typography>
            <Typography
              variant="subtitle1"
              fontFamily="monospace"
              color="text.primary"
            >
              {truncateAddress(address, 14)}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1.5} alignItems="center">
            {isLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              balance && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Typography variant="subtitle1">
                    {balance.balanceDisplayValue}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {balance.symbol}
                  </Typography>
                </Stack>
              )
            )}
            <IconButton
              onClick={() => {
                openNewTab({ url: getAvalancheAddressLink(address) });
              }}
            >
              <OutboundIcon />
            </IconButton>
          </Stack>
        </SectionRow>
      ))}
    </Section>
  );
};

const initialBalanceInfoMap = (addresses: string[]): BalanceInfoMap =>
  new Map(addresses.map((address) => [address, { isLoading: true }]));

const updateMap = (
  map: BalanceInfoMap,
  address: string,
  balance: TokenWithBalance | undefined,
): BalanceInfoMap => new Map(map).set(address, { isLoading: false, balance });
