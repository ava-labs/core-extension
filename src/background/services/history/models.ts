import { AnalyzeTxResult } from '@avalabs/bridge-unified';
import { NetworkVMType, Transaction } from '@avalabs/vm-module-types';

export interface TxHistoryItem<VMType = NetworkVMType> extends Transaction {
  bridgeAnalysis: AnalyzeTxResult;
  vmType?: VMType;
}
