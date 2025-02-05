import type { AnalyzeTxResult } from '@avalabs/bridge-unified';
import type { NetworkVMType, Transaction } from '@avalabs/vm-module-types';

export interface TxHistoryItem<VMType = NetworkVMType> extends Transaction {
  bridgeAnalysis: AnalyzeTxResult;
  vmType?: VMType;
}
