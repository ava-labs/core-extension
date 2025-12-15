import { FungibleTokenBalance } from '@core/types';

export type TokenSelectProps = {
  id: string;
  tokenId: string;
  tokenList: FungibleTokenBalance[];
  onValueChange: (tokenId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  hint?: string;
  disabled?: boolean;
};
