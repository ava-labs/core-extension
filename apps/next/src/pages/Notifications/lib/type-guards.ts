import { isTransferInProgress } from '@core/types';

import { CombinedActivityItem } from '../types';

export const isTransferItem = (
  item: CombinedActivityItem,
): item is Extract<
  CombinedActivityItem,
  { type: 'transfer' | 'legacy-transfer' }
> => {
  return item.type === 'transfer' || item.type === 'legacy-transfer';
};

export const isInProgress = (
  item: Exclude<CombinedActivityItem, { type: 'notification' }>,
): item is Extract<
  CombinedActivityItem,
  { type: 'transfer' | 'legacy-transfer' }
> => {
  return item.type === 'transfer'
    ? isTransferInProgress(item.item)
    : !item.item.completedAt;
};
