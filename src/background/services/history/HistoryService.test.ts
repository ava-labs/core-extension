import {
  PChainTransactionType,
  XChainTransactionType,
} from '@avalabs/glacier-sdk';
import {
  ChainId,
  Network,
  NetworkToken,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import { HistoryService } from './HistoryService';
import { TxHistoryItem } from './models';
import { TokenType } from '../balances/models';
import { TransactionType } from '@avalabs/vm-module-types';

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
    explorerUrl: 'https://explorer.url',
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
  const moduleManagereMock = {
    loadModuleByNetwork: jest.fn(),
  } as any;
  const accountsServiceMock = {
    activeAcount: {
      addressC: 'addressC',
    },
  } as any;

  const bridgeHistoryHelperServiceMock = {} as any;
  const unifiedBridgeServiceMock = {} as any;

  const txHistoryItem: TxHistoryItem = {
    isBridge: false,
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

  const btcTxHistoryItem: TxHistoryItem = {
    isBridge: false,
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
        name: 'BTC',
        symbol: 'BTC',
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
    isBridge: false,
    isContractCall: true,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: 1111,
    from: 'from',
    to: 'to',
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
    vmType: 'PVM',
    hash: 'hash',
  };

  const xchainTxHistoryItem: TxHistoryItem = {
    ...pchainTxHistoryItem,
    txType: XChainTransactionType.BASE_TX,
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
      moduleManagereMock,
      accountsServiceMock,
      bridgeHistoryHelperServiceMock,
      unifiedBridgeServiceMock
    );
  });

  it('should return empty array when network is not supported', async () => {
    const result = await service.getTxHistory({ vmName: 'hmmmmmm' } as any);
    expect(result).toEqual([]);
  });
  it('should return results from glacier if the network is supported', async () => {
    jest
      .spyOn(glacierServiceMock, 'isNetworkSupported')
      .mockResolvedValue(true);

    const result = await service.getTxHistory({
      chainId: ChainId.ETHEREUM_HOMESTEAD,
    } as any);
    expect(glacierServiceMock.isNetworkSupported).toHaveBeenCalledTimes(1);
    expect(result).toEqual([txHistoryItem, btcTxHistoryItem]);
  });

  it('should return results from btc history service when not supported by glacier and network has bitcoin vmType', async () => {
    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.BITCOIN,
      caipId: 'bip122:000000000019d6689c085ae165831e93',
    });
    expect(btcHistoryServiceMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([btcTxHistoryItem]);
  });
  it('should return results from btc history service when not supported by glacier and network has bitcoin vmType', async () => {
    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.BITCOIN,
      caipId: 'bip122:000000000019d6689c085ae165831e93',
    });
    expect(btcHistoryServiceMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([btcTxHistoryItem]);
  });
  it('should return results from eth history service when not supported by glacier and network has EVM vmType', async () => {
    const result = await service.getTxHistory({
      chainId: ChainId.ETHEREUM_HOMESTEAD,
    } as any);
    expect(ethHistoryServiceMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([txHistoryItem]);
  });
  it('should return results from pvm history service when not supported by glacier and isPchainNetwork', async () => {
    const result = await service.getTxHistory({
      vmName: NetworkVMType.PVM,
    } as any);
    expect(historyServicePVMMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([pchainTxHistoryItem]);
  });
  it('should return results from avm history service when not supported by glacier and network has AVM vmType', async () => {
    const result = await service.getTxHistory({
      vmName: NetworkVMType.AVM,
    } as any);
    expect(historyServiceAVMMock.getHistory).toHaveBeenCalledTimes(1);
    expect(result).toEqual([xchainTxHistoryItem]);
  });
});
