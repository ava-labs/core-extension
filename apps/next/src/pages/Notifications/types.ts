import { Transfer } from '@avalabs/fusion-sdk';

import { AppNotification } from '@core/types';

export type CombinedActivityItem = {
  timestamp: number;
} & (
  | {
      type: 'notification';
      item: AppNotification;
    }
  | {
      type: 'transfer';
      item: Transfer;
    }
);
