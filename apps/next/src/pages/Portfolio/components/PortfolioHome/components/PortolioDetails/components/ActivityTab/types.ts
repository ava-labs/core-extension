import { TxHistoryItem } from '@core/types';

export type ActivityFilter =
  | 'All'
  | 'Bridge'
  | 'Incoming'
  | 'Outgoing'
  | 'Contract_Call'
  | 'Swap'
  | 'NFTs';

export type ActivityFilterPredicate = (tx: TxHistoryItem) => boolean;
