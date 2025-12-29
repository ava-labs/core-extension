import { Stack } from '@avalabs/k2-alpine';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
  useWalletTotalBalanceContext,
} from '@core/ui';
import { NetworkWithCaipId } from '@core/types';
import { NETWORKS_ENABLED_FOREVER } from '@core/types';
import { useHistory } from 'react-router-dom';
import { NetworkToggleListItem } from './NetworkToggleListItem';
import { useEffect, useMemo, useRef } from 'react';

type NetworkToggleListProps = {
  networks: NetworkWithCaipId[];
};

const defaultNetworkSet = new Set(NETWORKS_ENABLED_FOREVER);
export const NetworkToggleList = ({ networks }: NetworkToggleListProps) => {
  const { enabledNetworks, enableNetwork, disableNetwork } =
    useNetworkContext();
  const history = useHistory();

  const { updateBalanceOnNetworks } = useBalancesContext();
  const { fetchWalletBalancesSequentially } = useWalletTotalBalanceContext();
  const { allAccounts } = useAccountsContext();

  // Use a stringified version for stable comparison
  const previousEnabledNetworksStringRef = useRef<string>('');

  // Store callbacks in refs to avoid dependency issues
  const updateBalanceOnNetworksRef = useRef(updateBalanceOnNetworks);
  const fetchWalletBalancesSequentiallyRef = useRef(
    fetchWalletBalancesSequentially,
  );
  const allAccountsRef = useRef(allAccounts);

  // Keep refs up to date
  useEffect(() => {
    updateBalanceOnNetworksRef.current = updateBalanceOnNetworks;
    fetchWalletBalancesSequentiallyRef.current =
      fetchWalletBalancesSequentially;
    allAccountsRef.current = allAccounts;
  }, [updateBalanceOnNetworks, fetchWalletBalancesSequentially, allAccounts]);

  const enabledNetworksArray = useMemo(
    () => enabledNetworks.map((network) => network.chainId) || [],
    [enabledNetworks],
  );

  // Create a stable string representation for comparison
  const enabledNetworksString = useMemo(
    () => enabledNetworksArray.join(','),
    [enabledNetworksArray],
  );

  // TODO: Clean up this balance refresh logic once balance-service-integration
  // feature flag is removed, at that point we shouldn't need to refresh balances manually.
  // Refresh balances when enabled networks change
  useEffect(() => {
    // Skip initial mount
    if (previousEnabledNetworksStringRef.current === '') {
      previousEnabledNetworksStringRef.current = enabledNetworksString;
      return;
    }

    // Check if enabled networks actually changed
    if (previousEnabledNetworksStringRef.current !== enabledNetworksString) {
      // Refresh wallet balances
      fetchWalletBalancesSequentiallyRef.current();

      // Refresh account balances for all accounts
      if (allAccountsRef.current.length > 0) {
        updateBalanceOnNetworksRef.current(allAccountsRef.current);
      }

      // Update the ref with current enabled networks string
      previousEnabledNetworksStringRef.current = enabledNetworksString;
    }
  }, [
    enabledNetworksString,
    updateBalanceOnNetworks,
    fetchWalletBalancesSequentially,
    allAccounts,
  ]);

  const sortedNetworks = useMemo(() => {
    return [...networks].sort((a, b) => {
      return (
        Number(defaultNetworkSet.has(b.chainId)) -
        Number(defaultNetworkSet.has(a.chainId))
      );
    });
  }, [networks]);

  return (
    <Stack
      sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
        maxHeight: '100%',
        width: '100%',
        rowGap: 1,
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {sortedNetworks.map((network) => (
        <NetworkToggleListItem
          key={network.chainId}
          network={network}
          isEnabled={enabledNetworksArray.includes(network.chainId)}
          isDefault={NETWORKS_ENABLED_FOREVER.includes(network.chainId)}
          onToggle={() => {
            if (enabledNetworksArray.includes(network.chainId)) {
              disableNetwork(network.chainId);
            } else {
              enableNetwork(network.chainId);
            }
          }}
          onClick={() => {
            history.push(
              `/settings/network-management/details/${network.chainId}`,
            );
          }}
        />
      ))}
    </Stack>
  );
};
