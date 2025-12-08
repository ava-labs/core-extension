import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { useNetworkContext } from '@core/ui';

import { SearchableSelect } from '../SearchableSelect';
import {
  ChainFilterChips,
  SelectedToken,
  TokenMenuItem,
  TokenSelectPrompt,
  TokenSelectTrigger,
} from './components';
import { compareTokens, searchTokens } from './lib/utils';

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
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);

  // Extract unique chain IDs from token list
  const availableChainIds = useMemo(() => {
    const chainIds = new Set(tokenList.map((token) => token.coreChainId));
    return Array.from(chainIds).sort((a, b) => a - b);
  }, [tokenList]);

  // Filter token list based on selected chain
  const filteredTokenList = useMemo(() => {
    if (selectedChainId === null) {
      return tokenList;
    }
    return tokenList.filter((token) => token.coreChainId === selectedChainId);
  }, [tokenList, selectedChainId]);

  const selectedToken = filteredTokenList.find(
    (token) => getUniqueTokenId(token) === tokenId,
  );

  // Get chain names for chips
  const chainOptions = useMemo(() => {
    return availableChainIds.map((chainId) => {
      const network = getNetwork(chainId);
      return {
        chainId,
        chainName: network?.chainName ?? `Chain ${chainId}`,
      };
    });
  }, [availableChainIds, getNetwork]);

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
        availableChainIds.length > 1 ? (
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
