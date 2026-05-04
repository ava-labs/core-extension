import { type AnalyzeTxResult } from '@avalabs/bridge-unified';
import { NetworkVMType, Transaction } from '@avalabs/vm-module-types';

export interface TxHistoryItem<VMType = NetworkVMType> extends Transaction {
  bridgeAnalysis: AnalyzeTxResult;
  vmType?: VMType;
  /**
   * USD price per token unit when history was loaded (mainnet activity path).
   * Keys match `useTokenPrice` lookup: native = symbol string; fungible = lowercase address.
   */
  historyTokenUsdPrices?: Record<string, number | null>;
}
