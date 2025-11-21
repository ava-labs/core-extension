import { useMemo } from 'react';
import {
  getAllAddressesForAccount,
  isAvalancheNetwork,
  isBitcoinNetwork,
  isEthereumNetwork,
  isPchainNetwork,
  isSolanaNetwork,
  isXchainNetwork,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import {
  useAccountsContext,
  useBalancesContext,
  useNetworkContext,
} from '@core/ui';

type Props = {
  walletId?: string;
  accountId?: string;
};
export const useNetworksWithBalance = ({
  walletId,
  accountId,
}: Props): Record<string, NetworkWithCaipId[]> => {
  const { getAccountsByWalletId, getAccountById } = useAccountsContext();
  const { getNetwork } = useNetworkContext();
  const {
    balances: { tokens: tokensByChain },
  } = useBalancesContext();

  const accounts = useMemo(() => {
    if (walletId) {
      return getAccountsByWalletId(walletId);
    }
    if (accountId) {
      const account = getAccountById(accountId);
      return account ? [account] : [];
    }
    return [];
  }, [walletId, accountId, getAccountsByWalletId, getAccountById]);
  console.log({ accounts });

  return useMemo(() => {
    const networksPerAccount: Record<string, NetworkWithCaipId[]> = {};

    // Initialize empty arrays for each account
    for (const account of accounts) {
      networksPerAccount[account.id] = [];
    }

    // Build a map of address to account ID for quick lookup
    const addressToAccountId = new Map<string, string>();
    for (const account of accounts) {
      const addresses = getAllAddressesForAccount(account);
      for (const address of addresses) {
        addressToAccountId.set(address, account.id);
      }
    }

    // Track unique networks per account
    const networksPerAccountSet = new Map<string, Set<number>>();
    for (const account of accounts) {
      networksPerAccountSet.set(account.id, new Set());
    }

    // Iterate through all token balances
    for (const [coreChainId, chainBalances] of Object.entries(
      tokensByChain ?? {},
    )) {
      const chainIdNum = Number(coreChainId);

      for (const [address, addressBalances] of Object.entries(
        chainBalances ?? {},
      )) {
        const currentAccountId = addressToAccountId.get(address);
        if (currentAccountId) {
          // Skip if we already know this account has balance on this network
          if (networksPerAccountSet.get(currentAccountId)?.has(chainIdNum)) {
            continue;
          }

          // Check if this address has any tokens with balance
          const hasBalance = Object.values(addressBalances).some(
            (token) => token.balance > 0n,
          );

          if (hasBalance) {
            networksPerAccountSet.get(currentAccountId)?.add(chainIdNum);
          }
        }
      }
    }

    // Convert network IDs to NetworkWithCaipId objects and sort by priority
    for (const [
      currentAccountId,
      networkIds,
    ] of networksPerAccountSet.entries()) {
      const networks: NetworkWithCaipId[] = [];
      for (const chainId of networkIds) {
        const network = getNetwork(chainId);
        if (network) {
          networks.push(network);
        }
      }

      // Sort networks by type priority
      networks.sort((a, b) => {
        const getPriority = (network: NetworkWithCaipId): number => {
          if (isAvalancheNetwork(network)) return 0; // C-chain first
          if (isPchainNetwork(network)) return 1; // P-chain second
          if (isXchainNetwork(network)) return 2; // X-chain third
          if (isBitcoinNetwork(network)) return 3; // Bitcoin fourth
          if (isEthereumNetwork(network)) return 4; // Ethereum fifth
          if (isSolanaNetwork(network)) return 5; // Solana sixth
          return 6; // Other networks last
        };

        return getPriority(a) - getPriority(b);
      });

      networksPerAccount[currentAccountId] = networks;
    }

    return networksPerAccount;
  }, [accounts, tokensByChain, getNetwork]);
};
