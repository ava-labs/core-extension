import { TxHistoryItem } from '@core/types';
import {
  NetworkVMType,
  TransactionType,
  PChainTransactionType,
  TokenType,
  XChainTransactionType,
} from '@avalabs/vm-module-types';
import { isPchainTxHistoryItem, isNonXPHistoryItem } from './isTxHistoryItem';

describe('src/background/services/history/utils/isTxHistoryItem.ts', () => {
  const txHistoryItem: TxHistoryItem = {
    bridgeAnalysis: {
      isBridgeTx: false,
    },
    isContractCall: true,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: 1111,
    hash: 'hash',
    from: 'from',
    to: 'to',
    tokens: [
      {
        name: 'tokenName',
        symbol: 'tokenSymbol',
        amount: 'tokenAmount',
        type: TokenType.NATIVE,
      },
    ],
    gasUsed: 'gasUsed',
    explorerLink: 'explorerLink',
    chainId: 'chainId',
    txType: TransactionType.SEND,
  };
  const pchainTxHistoryItem: TxHistoryItem = {
    bridgeAnalysis: {
      isBridgeTx: false,
    },
    isContractCall: true,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: 111111,
    from: 'from',
    to: 'to',
    hash: 'hash',
    tokens: [
      {
        name: 'tokenName',
        symbol: 'tokenSymbol',
        amount: 'amount',
        type: TokenType.NATIVE,
      },
    ],
    gasUsed: 'gasUsed',
    explorerLink: 'explorerLink',
    chainId: 'chainId',
    txType: PChainTransactionType.BASE_TX,
    vmType: NetworkVMType.PVM,
  };

  const xchainTxHistoryItem: TxHistoryItem = {
    ...pchainTxHistoryItem,
    txType: XChainTransactionType.BASE_TX,
    vmType: NetworkVMType.AVM,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('isTxHistoryItem', () => {
    it('should return true when the tx is txHistoryItem', () => {
      const result = isNonXPHistoryItem(txHistoryItem);
      expect(result).toBe(true);
    });
    it('should return false when the tx is not txHistoryItem', () => {
      const result = isNonXPHistoryItem(pchainTxHistoryItem);
      expect(result).toBe(false);
      const result2 = isNonXPHistoryItem(xchainTxHistoryItem);
      expect(result2).toBe(false);
    });
  });

  describe('isPchainTxHistoryItem', () => {
    it('should return true when the tx is PchainTxHistoryItem', () => {
      const result = isPchainTxHistoryItem(pchainTxHistoryItem);
      expect(result).toBe(true);
    });
    it('should return false when the tx is not PchainTxHistoryItem', () => {
      const result = isPchainTxHistoryItem(txHistoryItem);
      expect(result).toBe(false);
      const result2 = isPchainTxHistoryItem(xchainTxHistoryItem);
      expect(result2).toBe(false);
    });
  });
});
