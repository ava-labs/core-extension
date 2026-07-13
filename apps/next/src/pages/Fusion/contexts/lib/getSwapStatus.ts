import { Quote, TransferManager } from '@avalabs/fusion-sdk';

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
  isTargetTokenListLoading = false,
  isTargetSearchActive = false,
  isTargetSelectOpen = false,
  isTargetTokenListFetching = false,
  hasSelectedTarget = false,
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

  // While the target dropdown is open the user may be browsing other chains,
  // which transiently empties the list / toggles loading. Keep the form mounted
  // so the dropdown stays open and handles those states inline.
  if (isTargetTokenListLoading && !isTargetSelectOpen) {
    return 'loading';
  }

  // Only treat an empty target list as "no routes" once we're confident it's
  // final: not while search is active, the dropdown is open, or a fetch is
  // still in flight (e.g. right after the source token changes). Those are
  // handled inline / kept on the form to avoid a flash of the error screen.
  if (
    !isTargetSearchActive &&
    !isTargetSelectOpen &&
    !isTargetTokenListFetching &&
    !hasSelectedTarget &&
    targetTokenList.length === 0
  ) {
    return 'no-routes-found';
  }

  if (selectedQuote) {
    return 'ready-to-transfer';
  }

  return 'initialized';
};
