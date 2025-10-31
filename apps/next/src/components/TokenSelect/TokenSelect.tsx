import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { SearchableSelect } from '../SearchableSelect';
import {
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
  tokenBalance?: boolean;
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
  tokenBalance = true,
}: TokenSelectProps) {
  const { t } = useTranslation();

  const selectedToken = tokenList.find(
    (token) => getUniqueTokenId(token) === tokenId,
  );

  return (
    <SearchableSelect<FungibleTokenBalance>
      id={id}
      disabled={disabled}
      options={tokenList}
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
          <SelectedToken token={token} hint={hint} balance={tokenBalance} />
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
    />
  );
}

export const TokenSelect = memo(TokenSelectRaw);
