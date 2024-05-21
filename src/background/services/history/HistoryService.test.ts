import {
  PChainTransactionType,
  XChainTransactionType,
} from '@avalabs/glacier-sdk';
import { Network, NetworkToken, NetworkVMType } from '@avalabs/chains-sdk';
import { HistoryService } from './HistoryService';
import {
  PchainTxHistoryItem,
  TransactionType,
  TxHistoryItem,
  XchainTxHistoryItem,
} from './models';
import { TokenType } from '../balances/models';
import { isEthereumNetwork } from '../network/utils/isEthereumNetwork';
import { isPchainNetwork } from '../network/utils/isAvalanchePchainNetwork';
import { isXchainNetwork } from '../network/utils/isAvalancheXchainNetwork';

jest.mock('../network/utils/isEthereumNetwork', () => ({
  isEthereumNetwork: jest.fn(),
}));
jest.mock('../network/utils/isAvalanchePchainNetwork', () => ({
  isPchainNetwork: jest.fn(),
}));
jest.mock('../network/utils/isAvalancheXchainNetwork', () => ({
  isXchainNetwork: jest.fn(),
}));

describe('src/background/services/history/HistoryService.ts', () => {
  let service: HistoryService;

  const networkToken1: NetworkToken = {
    name: 'network token 1',
    symbol: 'NT1',
    description: 'network token for network 1',
    decimals: 12,
    logoUri: 'network.token.one.com',
  };
  const network1: Network = {
    chainName: 'test network 1',
    chainId: 1,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'test.one.com/rpc',
    networkToken: networkToken1,
    logoUri: 'test.one.com/logo',
    primaryColor: 'purple',
  };
  const networkServiceMock = {
    activeNetwork: network1,
  } as any;
  const btcHistoryServiceMock = {
    getHistory: jest.fn(),
  } as any;
  const ethHistoryServiceMock = {
    getHistory: jest.fn(),
  } as any;
  const historyServicePVMMock = {
    getHistory: jest.fn(),
  } as any;
  const historyServiceAVMMock = {
    getHistory: jest.fn(),
  } as any;
  const glacierHistoryServiceMock = {
    getHistory: jest.fn(),
  } as any;
  const glacierServiceMock = {
    isNetworkSupported: jest.fn(),
  } as any;

  const txHistoryItem: TxHistoryItem = {
    isBridge: false,
    isContractCall: true,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: 'timestamp',
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
    type: TransactionType.SEND,
  };

  const btcTxHistoryItem: TxHistoryItem = {
    isBridge: false,
    isContractCall: true,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: 'timestamp',
    hash: 'hash',
    from: 'from',
    to: 'to',
    tokens: [
      {
        name: 'BTC',
        symbol: 'BTC',
        amount: 'tokenAmount',
        type: TokenType.NATIVE,
      },
    ],
    gasUsed: 'gasUsed',
    explorerLink: 'explorerLink',
    chainId: 'chainId',
    type: TransactionType.SEND,
  };
  const pchainTxHistoryItem: PchainTxHistoryItem = {
    isSender: true,
    timestamp: 'timestamp',
    from: ['from'],
    to: ['to'],
    token: {
      name: 'tokenName',
      symbol: 'tokenSymbol',
      amount: 'amount',
      type: TokenType.NATIVE,
    },
    gasUsed: 'gasUsed',
    explorerLink: 'explorerLink',
    chainId: 'chainId',
    type: PChainTransactionType.BASE_TX,
    vmType: 'PVM',
  };

  const xchainTxHistoryItem: XchainTxHistoryItem = {
    ...pchainTxHistoryItem,
    type: XChainTransactionType.BASE_TX,
    vmType: 'AVM',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    networkServiceMock.activeNetwork = network1;
    jest
      .mocked(btcHistoryServiceMock.getHistory)
      .mockResolvedValue([btcTxHistoryItem]);
    jest
      .mocked(ethHistoryServiceMock.getHistory)
      .mockResolvedValue([txHistoryItem]);
    jest
      .mocked(glacierHistoryServiceMock.getHistory)
      .mockResolvedValue([txHistoryItem, btcTxHistoryItem]);
    jest.mocked(glacierServiceMock.isNetworkSupported).mockResolvedValue(false);
    jest
      .mocked(historyServiceAVMMock.getHistory)
      .mockResolvedValue([xchainTxHistoryItem]);
    jest
      .mocked(historyServicePVMMock.getHistory)
      .mockResolvedValue([pchainTxHistoryItem]);

    service = new HistoryService(
      networkServiceMock,
      btcHistoryServiceMock,
      ethHistoryServiceMock,
      glacierHistoryServiceMock,
      glacierServiceMock,
      historyServiceAVMMock,
      historyServicePVMMock
    );
  });

  it('should return empty array when no active network', async () => {
    networkServiceMock.activeNetwork = undefined;

    const result = await service.getTxHistory();
    expect(result).toEqual([]);
  });
  it('should return results from glacier if the network is supported', async () => {
    jest
      .spyOn(glacierServiceMock, 'isNetworkSupported')
      .mockResolvedValue(true);

    const result = await service.getTxHistory();
    expect(glacierServiceMock.isNetworkSupported).toHaveBeenCalledTimes(1);
    expect(result).toEqual([txHistoryItem, btcTxHistoryItem]);
  });

  it('should return results from btc history service when not supported by glacier and network has bitcoin vmType', async () => {
    networkServiceMock.activeNetwork = {
      ...network1,
      vmName: NetworkVMType.BITCOIN,
    };
    const result = await service.getTxHistory();
    expect(btcHistoryServiceMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([btcTxHistoryItem]);
  });
  it('should return results from btc history service when not supported by glacier and network has bitcoin vmType', async () => {
    networkServiceMock.activeNetwork = {
      ...network1,
      vmName: NetworkVMType.BITCOIN,
    };
    const result = await service.getTxHistory();
    expect(btcHistoryServiceMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([btcTxHistoryItem]);
  });
  it('should return results from eth history service when not supported by glacier and network has EVM vmType', async () => {
    (isEthereumNetwork as jest.Mock).mockReturnValue(true);
    const result = await service.getTxHistory();
    expect(ethHistoryServiceMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([txHistoryItem]);
  });
  it('should return results from pvm history service when not supported by glacier and isPchainNetwork', async () => {
    (isPchainNetwork as jest.Mock).mockReturnValue(true);
    const result = await service.getTxHistory();
    expect(historyServicePVMMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([pchainTxHistoryItem]);
  });
  it('should return results from avm history service when not supported by glacier and network has AVM vmType', async () => {
    (isXchainNetwork as jest.Mock).mockReturnValue(true);
    const result = await service.getTxHistory();
    expect(historyServiceAVMMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([xchainTxHistoryItem]);
  });
});
