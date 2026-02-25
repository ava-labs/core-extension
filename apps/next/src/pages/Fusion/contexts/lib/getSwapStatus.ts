import { Quote, TransferManager } from '@avalabs/unified-asset-transfer';

import { Account, FungibleTokenBalance } from '@core/types';

import { SwapStatus } from '../../types';

export const getSwapStatus = (
  activeAccount: Account | undefined,
  isBalancesLoading: boolean,
  manager: TransferManager | undefined,
  initializationError: boolean,
  sourceTokenList: FungibleTokenBalance[],
  targetTokenList: FungibleTokenBalance[],
  selectedQuote: Quote | null,
): SwapStatus => {
  const isAccountLoading = !activeAccount;
  const isManagerLoading = !manager && !initializationError;

  if (isAccountLoading || isBalancesLoading || isManagerLoading) {
    return 'loading';
  }

  if (initializationError) {
    return 'initialization-failed';
  }

  if (sourceTokenList.length === 0) {
    return 'no-swappable-assets';
  }

  if (targetTokenList.length === 0) {
    return 'no-routes-found';
  }

  if (selectedQuote) {
    return 'ready-to-transfer';
  }

  return 'initialized';
};
