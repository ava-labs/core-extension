import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { SearchableSelect } from '../SearchableSelect';
import {
  ChainFilterChips,
  SelectedToken,
  TokenMenuItem,
  TokenSelectPrompt,
  TokenSelectTrigger,
} from './components';
import { compareTokens, searchTokens } from './lib/utils';
import {
  useChainIds,
  useChainOptions,
  useFilteredTokenList,
  useIsAnyAvalancheNetwork,
} from './hooks';
import { TokenSelectProps } from './types';
import { areTokenListsEqual } from './utils';

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
  const [selectedChainId, setSelectedChainId] = useState<
    number | 'avalanche' | null
  >(null);

  const isAnyAvalancheNetwork = useIsAnyAvalancheNetwork();
  const { availableChainIds, hasAvalancheNetworks } = useChainIds(
    tokenList,
    isAnyAvalancheNetwork,
  );
  const filteredTokenList = useFilteredTokenList(
    tokenList,
    selectedChainId,
    isAnyAvalancheNetwork,
  );
  const chainOptions = useChainOptions(availableChainIds, hasAvalancheNetworks);

  const selectedToken = useMemo(
    () =>
      filteredTokenList.find((token) => getUniqueTokenId(token) === tokenId),
    [filteredTokenList, tokenId],
  );

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

export const TokenSelect = memo(TokenSelectRaw, areTokenListsEqual);
