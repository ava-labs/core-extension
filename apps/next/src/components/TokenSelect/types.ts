import { FungibleTokenBalance } from '@core/types';
import { type ChainOption } from './components/ChainFilterChips';

export type TokenSelectProps = {
  id: string;
  tokenId: string;
  tokenList: FungibleTokenBalance[];
  onValueChange: (tokenId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  hint?: string;
  disabled?: boolean;
  onEndReached?: () => void;
  defaultChainId?: number | 'avalanche' | null;
  externalChainOptions?: ChainOption[];
  onChainChange?: (chainId: number | 'avalanche' | null) => void;
  /**
   * Controlled selected chain chip. When provided, the component does not keep
   * its own chain state and relies entirely on this value + `onChainChange`.
   */
  selectedChainId?: number | 'avalanche' | null;
  /** Notified whenever the dropdown opens (true) or closes (false). */
  onOpenChange?: (isOpen: boolean) => void;
  /** Show a loading indicator in place of the "no results" message while the token list is being (re)fetched, e.g. on chain change. */
  isLoadingTokens?: boolean;
  /** Token to show in the trigger when tokenId is not found in tokenList (e.g. during chain change). Not added to the dropdown list. */
  selectedTokenFallback?: FungibleTokenBalance;
};
