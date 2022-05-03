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

export type PartialBridgeTransaction = Pick<
  BridgeTransaction,
  | 'sourceChain'
  | 'sourceTxHash'
  | 'sourceStartedAt'
  | 'targetChain'
  | 'amount'
  | 'symbol'
>;

export enum BridgeEvents {
  BRIDGE_CONFIG_UPDATE_EVENT = 'BRIDGE_CONFIG_UPDATE_EVENT',
  BRIDGE_TRANSACTIONS_UPDATED = 'BRIDGE_TRANSACTIONS_UPDATED',
  BRIDGE_TRANSFER_EVENT = 'BRIDGE_TRANSFER_EVENT',
}

export const BRIDGE_STORAGE_KEY = 'bridge';

export const DefaultBridgeState: BridgeState = {
  bridgeTransactions: {},
};
