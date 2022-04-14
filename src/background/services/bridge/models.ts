import { BridgeTransaction, WrapStatus } from '@avalabs/bridge-sdk';

export enum TransferEventType {
  WRAP_STATUS = 'wrap_status',
  TX_HASH = 'tx_hash',
}

export type TransferEvent =
  | {
      type: TransferEventType.WRAP_STATUS;
      status: WrapStatus;
    }
  | {
      type: TransferEventType.TX_HASH;
      txHash: string;
    };

export interface BridgeState {
  bridgeTransactions: {
    [key: string]: BridgeTransaction;
  };
}
