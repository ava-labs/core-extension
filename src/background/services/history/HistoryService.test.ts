import { Network, NetworkToken, NetworkVMType } from '@avalabs/core-chains-sdk';
import { HistoryService } from './HistoryService';
import { TxHistoryItem } from './models';
import { TokenType } from '@avalabs/vm-module-types';
import { TransactionType } from '@avalabs/vm-module-types';
import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';

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

  const moduleManagereMock = {
    loadModuleByNetwork: jest.fn(),
  } as any;
  const accountsServiceMock = {
    activeAccount: {
      addressC: 'addressC',
      addressBTC: 'addressBtc',
      addressPVM: 'addressBtc',
      addressAVM: 'addressBtc',
    },
  } as any;
  const bridgeHistoryHelperServiceMock = {
    isBridgeTransactionBTC: jest.fn(),
  } as any;
  const unifiedBridgeServiceMock = {
    state: {
      addresses: [],
    },
  } as any;

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
    vmType: NetworkVMType.EVM,
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
    vmType: NetworkVMType.BITCOIN,
  };

  beforeEach(() => {
    jest.resetAllMocks();

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
  it('should return empty array when theere is no addres for the network', async () => {
    const result = await service.getTxHistory({
      vmName: NetworkVMType.CoreEth,
    } as any);
    expect(result).toEqual([]);
  });
  it('should return empty array when there is no transactions in the past', async () => {
    jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
      getTransactionHistory: jest.fn(() => {
        return { transactions: [] };
      }),
    });
    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.BITCOIN,
      caipId: 'bip122:000000000019d6689c085ae165831e93',
    });
    expect(result).toEqual([]);
  });

  it('should return results from btc history', async () => {
    jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
      getTransactionHistory: jest.fn(() => {
        return { transactions: [btcTxHistoryItem] };
      }),
    });
    jest
      .mocked(bridgeHistoryHelperServiceMock.isBridgeTransactionBTC)
      .mockReturnValue(false);
    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.BITCOIN,
      caipId: 'bip122:000000000019d6689c085ae165831e93',
    });
    expect(result).toEqual([btcTxHistoryItem]);
  });
  it('should return results with a BTC bridge transaction', async () => {
    jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
      getTransactionHistory: jest.fn(() => {
        return { transactions: [btcTxHistoryItem] };
      }),
    });
    jest
      .mocked(bridgeHistoryHelperServiceMock.isBridgeTransactionBTC)
      .mockReturnValue(true);
    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.BITCOIN,
      caipId: 'bip122:000000000019d6689c085ae165831e93',
    });

    expect(result).toEqual([{ ...btcTxHistoryItem, isBridge: true }]);
  });
  it('should return results with an ETH bridge transaction', async () => {
    jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
      getTransactionHistory: jest.fn(() => {
        return {
          transactions: [
            {
              ...txHistoryItem,
              from: ETHEREUM_ADDRESS,
            },
          ],
        };
      }),
    });
    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.EVM,
      caipId: 'caip',
    });
    expect(result).toEqual([
      { ...txHistoryItem, isBridge: true, from: ETHEREUM_ADDRESS },
    ]);
  });
  it('should return results with an pchain transaction', async () => {
    jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
      getTransactionHistory: jest.fn(() => {
        return {
          transactions: [txHistoryItem],
        };
      }),
    });

    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.PVM,
      caipId: 'caip',
    });

    expect(result).toEqual([{ ...txHistoryItem, vmType: 'PVM' }]);
  });
});
