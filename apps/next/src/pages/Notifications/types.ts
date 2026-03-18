import { BridgeTransfer } from '@avalabs/bridge-unified';
import { Transfer } from '@avalabs/fusion-sdk';

import { AppNotification } from '@core/types';

export type CombinedActivityItem = {
  id: string;
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
  | {
      type: 'legacy-transfer';
      item: BridgeTransfer;
    }
);
