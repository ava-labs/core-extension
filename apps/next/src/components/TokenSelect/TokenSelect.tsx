import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FungibleTokenBalance,
  getUniqueTokenId,
  isPChainToken,
  isXChainToken,
} from '@core/types';
import { useNetworkContext } from '@core/ui';
import {
  isAvalancheChainId,
  isPchainNetworkId,
  isXchainNetworkId,
} from '@core/common';

import { SearchableSelect } from '../SearchableSelect';
import {
  ChainFilterChips,
  ChainOption,
  SelectedToken,
  TokenMenuItem,
  TokenSelectPrompt,
  TokenSelectTrigger,
} from './components';
import { compareTokens, searchTokens } from './lib/utils';
import { isAvaxToken } from '@/hooks/useTokensForAccount';
import { ChainId } from '@avalabs/core-chains-sdk';

type TokenSelectProps = {
  id: string;
  tokenId: string;
  tokenList: FungibleTokenBalance[];
  onValueChange: (tokenId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  hint?: string;
  disabled?: boolean;
};

function TokenSelectRaw({
  id,
  tokenId,
  tokenList,
  onValueChange,
  query,
  onQueryChange,
  hint,
  disabled,
}: TokenSelectProps) {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();
  const [selectedChainId, setSelectedChainId] = useState<
    number | 'avalanche' | null
  >(null);

  // Helper to check if a chain ID is any Avalanche network (C, X, or P)
  const isAnyAvalancheNetwork = useCallback((chainId: number): boolean => {
    const isAvalancheNetwork =
      isAvalancheChainId(chainId) ||
      isPchainNetworkId(chainId) ||
      isXchainNetworkId(chainId);
    return isAvalancheNetwork;
  }, []);

  // Extract unique chain IDs from token list and group Avalanche networks
  const { availableChainIds, hasAvalancheNetworks } = useMemo(() => {
    const chainIds = new Set(tokenList.map((token) => token.coreChainId));
    const allChainIds = Array.from(chainIds);

    // Separate Avalanche and non-Avalanche networks
    const avalancheChainIds: number[] = [];
    const nonAvalancheChainIds: number[] = [];

    allChainIds.forEach((chainId) => {
      if (isAnyAvalancheNetwork(chainId)) {
        avalancheChainIds.push(chainId);
      } else {
        nonAvalancheChainIds.push(chainId);
      }
    });

    // Sort non-Avalanche chains
    nonAvalancheChainIds.sort((a, b) => a - b);

    return {
      availableChainIds: nonAvalancheChainIds,
      hasAvalancheNetworks: avalancheChainIds.length > 0,
    };
  }, [tokenList, isAnyAvalancheNetwork]);

  // Filter token list based on selected chain and sort by balance
  const filteredTokenList = useMemo(() => {
    let filtered: FungibleTokenBalance[];
    if (selectedChainId === null) {
      filtered = tokenList;
    } else if (selectedChainId === 'avalanche') {
      filtered = tokenList.filter((token) =>
        isAnyAvalancheNetwork(token.coreChainId),
      );
    } else {
      filtered = tokenList.filter(
        (token) => token.coreChainId === selectedChainId,
      );
    }

    // Sort by balance in descending order (highest balance first)
    return [...filtered].sort((a, b) => {
      const isAvaxA = isAvaxToken(a);
      const isAvaxB = isAvaxToken(b);

      // AVAX tokens always come first
      if (isAvaxA && !isAvaxB) return -1;
      if (!isAvaxA && isAvaxB) return 1;

      // Get balance using the same logic as getAvailableBalance
      const balanceA =
        isPChainToken(a) || isXChainToken(a)
          ? (a.available ?? a.balance)
          : a.balance;
      const balanceB =
        isPChainToken(b) || isXChainToken(b)
          ? (b.available ?? b.balance)
          : b.balance;

      // Sort in descending order (highest balance first)
      if (balanceA > balanceB) return -1;
      if (balanceA < balanceB) return 1;
      return 0;
    });
  }, [isAnyAvalancheNetwork, selectedChainId, tokenList]);

  const selectedToken = filteredTokenList.find(
    (token) => getUniqueTokenId(token) === tokenId,
  );

  // Get chain names for chips
  const chainOptions = useMemo(() => {
    const options: Array<ChainOption> = [];

    // Add Avalanche option if there are Avalanche networks
    if (hasAvalancheNetworks) {
      options.push({
        chainId: 'avalanche',
        chainName: 'Avalanche',
        logoUri: getNetwork(ChainId.AVALANCHE_MAINNET_ID)?.logoUri ?? '',
      });
    }

    // Add other chain options
    availableChainIds.forEach((chainId) => {
      const network = getNetwork(chainId);
      options.push({
        chainId,
        chainName: network?.chainName ?? `Chain ${chainId}`,
        logoUri: network?.logoUri,
      });
    });

    return options;
  }, [availableChainIds, hasAvalancheNetworks, getNetwork]);

  return (
    <SearchableSelect<FungibleTokenBalance>
      id={id}
      disabled={disabled}
      options={filteredTokenList}
      getOptionId={getUniqueTokenId}
      groupBy={() => ''} // No grouping
      getGroupLabel={() => ''}
      isOptionEqualToValue={compareTokens}
      searchFn={searchTokens}
      query={query}
      onQueryChange={onQueryChange}
      value={selectedToken}
      onValueChange={(token) => onValueChange(getUniqueTokenId(token))}
      label={t('Token')}
      skipGroupingEntirely
      slots={{
        trigger: TokenSelectTrigger,
      }}
      renderValue={(token) =>
        token ? (
          <SelectedToken token={token} hint={hint} />
        ) : (
          <TokenSelectPrompt />
        )
      }
      renderOption={(token, getOptionProps) => (
        <TokenMenuItem
          key={getUniqueTokenId(token)}
          {...getOptionProps(token)}
          token={token}
        />
      )}
      renderChips={
        chainOptions.length > 1 ? (
          <ChainFilterChips
            chainOptions={chainOptions}
            selectedChainId={selectedChainId}
            onChainSelect={setSelectedChainId}
          />
        ) : undefined
      }
    />
  );
}

export const TokenSelect = memo(TokenSelectRaw);
