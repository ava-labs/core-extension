import {
  NetworkVMType,
  Transaction,
  TransactionType,
} from '@avalabs/vm-module-types';

export interface TxHistoryItem extends Transaction {
  isBridge: boolean;
  vmType?: NetworkVMType;
}

export const NonContractCallTypes = [
  TransactionType.BRIDGE,
  TransactionType.SEND,
  TransactionType.RECEIVE,
  TransactionType.TRANSFER,
];

export interface HistoryItemCategories {
  isBridge: boolean;
  isSwap: boolean;
  isNativeSend: boolean;
  isNativeReceive: boolean;
  isNFTPurchase: boolean;
  isApprove: boolean;
  isTransfer: boolean;
  isAirdrop: boolean;
  isUnwrap: boolean;
  isFillOrder: boolean;
  isContractCall: boolean;
  method: string;
  type: TransactionType;
}

export interface SubnetHistoryItem {
  hash: string;
  status: number;
  gasPrice: number;
  gasUsed: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  method: string;
  type: number;
  block: number;
  toContract?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
