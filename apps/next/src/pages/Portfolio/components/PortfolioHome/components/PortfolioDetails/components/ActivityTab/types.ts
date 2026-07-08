import { TxHistoryItem } from '@core/types';

export type ActivityFilter =
  | 'All'
  | 'Sent'
  | 'Received'
  | 'Swap'
  | 'Bridge'
  | 'NFT'
  | 'Contract_Call';

export type ActivityFilterPredicate = (tx: TxHistoryItem) => boolean;
