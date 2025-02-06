import {
  Asset,
  Blockchain,
  BridgeTransaction,
  WrapStatus,
} from '@avalabs/core-bridge-sdk';
import { Network } from '@avalabs/core-chains-sdk';
import { TokenWithBalance } from '@avalabs/vm-module-types';

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
  isDevEnv: boolean;
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
  BRIDGE_STATE_UPDATE_EVENT = 'BRIDGE_STATE_UPDATE_EVENT',
  BRIDGE_TRANSFER_EVENT = 'BRIDGE_TRANSFER_EVENT',
}

export const BRIDGE_STORAGE_KEY = 'bridge';

export const DefaultBridgeState: BridgeState = {
  bridgeTransactions: {},
  isDevEnv: false,
};

export interface BtcTransactionResponse {
  hash: string;
  gasLimit: bigint;
  value: bigint;
  confirmations: number;
  from: string;
}

export type CustomGasSettings = {
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasLimit?: bigint;
};

export type BridgeActionDisplayData = {
  currentBlockchain: Blockchain;
  sourceNetwork: Network;
  targetNetwork: Network;
  amountStr: string;
  asset: Asset;
  token: TokenWithBalance;
  gasLimit: bigint;
  gasSettings?: CustomGasSettings;
};
