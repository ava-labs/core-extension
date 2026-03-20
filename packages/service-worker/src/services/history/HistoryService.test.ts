import { Network, NetworkToken } from '@avalabs/core-chains-sdk';
import { HistoryService } from './HistoryService';
import { TxHistoryItem } from '@core/types';
import { NetworkVMType, TokenType } from '@avalabs/vm-module-types';
import { TransactionType } from '@avalabs/vm-module-types';
import { ETHEREUM_ADDRESS } from '@core/common';
import { BridgeType } from '@avalabs/bridge-unified';

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
    getActiveAccount: async () => ({
      addressC: 'addressC',
      addressBTC: 'addressBtc',
      addressPVM: 'addressBtc',
      addressAVM: 'addressBtc',
    }),
  } as any;
  const unifiedBridgeServiceMock = {
    analyzeTx: jest.fn(),
  } as any;
  const balanceAggregatorServiceMock = {
    balances: {},
  } as any;
  const tokenPricesServiceMock = {
    getPriceChangesData: jest.fn().mockResolvedValue({}),
  } as any;

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
        amount: '1',
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
        name: 'BTC',
        symbol: 'BTC',
        amount: '1',
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

    jest
      .mocked(tokenPricesServiceMock.getPriceChangesData)
      .mockResolvedValue({});

    service = new HistoryService(
      moduleManagereMock,
      accountsServiceMock,
      unifiedBridgeServiceMock,
      balanceAggregatorServiceMock,
      tokenPricesServiceMock,
    );

    jest
      .mocked(unifiedBridgeServiceMock.analyzeTx)
      .mockReturnValue({ isBridgeTx: false });
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
    const result = await service.getTxHistory({
      ...network1,
      vmName: NetworkVMType.BITCOIN,
      caipId: 'bip122:000000000019d6689c085ae165831e93',
    });

    expect(result).toEqual([
      { ...btcTxHistoryItem, bridgeAnalysis: { isBridgeTx: false } },
    ]);
  });
  it('should return results with an ETH bridge transaction', async () => {
    jest.mocked(unifiedBridgeServiceMock.analyzeTx).mockReturnValue({
      isBridgeTx: true,
      bridgeType: BridgeType.AVALANCHE_EVM,
    });
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
      {
        ...txHistoryItem,
        bridgeAnalysis: {
          bridgeType: BridgeType.AVALANCHE_EVM,
          isBridgeTx: true,
        },
        from: ETHEREUM_ADDRESS,
      },
    ]);
  });
  it('should enrich SVM network tokens with cached SPL balances', async () => {
    const splToken = {
      name: 'POPCAT',
      symbol: 'POPCAT',
      decimals: 9,
      address: 'POPCATmintAddress',
      type: TokenType.SPL,
      balance: 100n,
      balanceDisplayValue: '100',
      logoUri: 'popcat.png',
    };

    balanceAggregatorServiceMock.balances = {
      900: {
        addressSVM: {
          SOL: {
            name: 'Solana',
            symbol: 'SOL',
            type: TokenType.NATIVE,
            decimals: 9,
            balance: 1000n,
            balanceDisplayValue: '1',
          },
          POPCATmintAddress: splToken,
        },
      },
    };

    const getTransactionHistoryMock = jest.fn().mockResolvedValue({
      transactions: [txHistoryItem],
    });

    jest
      .mocked(moduleManagereMock.loadModuleByNetwork)
      .mockResolvedValue({ getTransactionHistory: getTransactionHistoryMock });

    jest
      .mocked(unifiedBridgeServiceMock.analyzeTx)
      .mockReturnValue({ isBridgeTx: false });

    const svmNetwork = {
      ...network1,
      chainId: 900,
      vmName: NetworkVMType.SVM,
      caipId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    };

    const accountsServiceWithSVM = {
      getActiveAccount: async () => ({
        addressC: 'addressC',
        addressBTC: 'addressBtc',
        addressPVM: 'addressBtc',
        addressAVM: 'addressBtc',
        addressSVM: 'addressSVM',
      }),
    } as any;

    const svcWithSVM = new HistoryService(
      moduleManagereMock,
      accountsServiceWithSVM,
      unifiedBridgeServiceMock,
      balanceAggregatorServiceMock,
      tokenPricesServiceMock,
    );

    await svcWithSVM.getTxHistory(svmNetwork);

    const calledNetwork = getTransactionHistoryMock.mock.calls[0]?.[0]?.network;
    const enrichedTokens = calledNetwork?.tokens ?? [];
    expect(enrichedTokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: 'POPCATmintAddress',
          symbol: 'POPCAT',
          contractType: TokenType.SPL,
          type: TokenType.SPL,
        }),
      ]),
    );
  });

  it('should enrich SVM network tokens from all accounts, not just the active one', async () => {
    balanceAggregatorServiceMock.balances = {
      900: {
        account1Address: {
          POPCATmintAddress: {
            name: 'POPCAT',
            symbol: 'POPCAT',
            decimals: 9,
            address: 'POPCATmintAddress',
            type: TokenType.SPL,
            balance: 100n,
            balanceDisplayValue: '100',
            logoUri: 'popcat.png',
          },
        },
        account2Address: {
          WIFmintAddress: {
            name: 'dogwifhat',
            symbol: 'WIF',
            decimals: 6,
            address: 'WIFmintAddress',
            type: TokenType.SPL,
            balance: 50n,
            balanceDisplayValue: '50',
            logoUri: 'wif.png',
          },
        },
      },
    };

    const getTransactionHistoryMock = jest.fn().mockResolvedValue({
      transactions: [txHistoryItem],
    });

    jest
      .mocked(moduleManagereMock.loadModuleByNetwork)
      .mockResolvedValue({ getTransactionHistory: getTransactionHistoryMock });

    jest
      .mocked(unifiedBridgeServiceMock.analyzeTx)
      .mockReturnValue({ isBridgeTx: false });

    const svmNetwork = {
      ...network1,
      chainId: 900,
      vmName: NetworkVMType.SVM,
      caipId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    };

    const accountsServiceWithSVM = {
      getActiveAccount: async () => ({
        addressC: 'addressC',
        addressBTC: 'addressBtc',
        addressPVM: 'addressBtc',
        addressAVM: 'addressBtc',
        addressSVM: 'account1Address',
      }),
    } as any;

    const svcWithSVM = new HistoryService(
      moduleManagereMock,
      accountsServiceWithSVM,
      unifiedBridgeServiceMock,
      balanceAggregatorServiceMock,
      tokenPricesServiceMock,
    );

    await svcWithSVM.getTxHistory(svmNetwork);

    const calledNetwork = getTransactionHistoryMock.mock.calls[0]?.[0]?.network;
    const enrichedTokens = calledNetwork?.tokens ?? [];
    expect(enrichedTokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: 'POPCATmintAddress',
          symbol: 'POPCAT',
        }),
        expect.objectContaining({
          address: 'WIFmintAddress',
          symbol: 'WIF',
        }),
      ]),
    );
  });

  it('should return results with an pchain transaction', async () => {
    jest
      .mocked(unifiedBridgeServiceMock.analyzeTx)
      .mockReturnValue({ isBridgeTx: false });
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

  describe('spam filtering', () => {
    const evmNetwork = {
      ...network1,
      vmName: NetworkVMType.EVM,
      caipId: 'eip155:43114',
    };

    const spamTx = {
      ...txHistoryItem,
      tokens: [
        {
          name: 'SpamToken',
          symbol: 'SPAM',
          amount: '0.000001',
          type: TokenType.ERC20,
          address: '0xspamtoken',
        },
      ],
    };

    const legitimateTx = {
      ...txHistoryItem,
      tokens: [
        {
          name: 'LegitToken',
          symbol: 'LEGIT',
          amount: '100',
          type: TokenType.ERC20,
          address: '0xlegittoken',
        },
      ],
    };

    it('should filter out spam transactions below $0.01', async () => {
      jest
        .mocked(tokenPricesServiceMock.getPriceChangesData)
        .mockResolvedValue({
          'eip155:43114-0xspamtoken': { currentPrice: 0.001, platforms: {} },
          'eip155:43114-0xlegittoken': { currentPrice: 50, platforms: {} },
        });

      jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
        getTransactionHistory: jest.fn().mockResolvedValue({
          transactions: [spamTx, legitimateTx],
        }),
      });

      const result = await service.getTxHistory(evmNetwork);

      expect(result).toHaveLength(1);
      expect(result[0]?.tokens[0]?.symbol).toBe('LEGIT');
    });

    it('should fetch additional pages when filtered results are insufficient', async () => {
      const getTransactionHistoryMock = jest
        .fn()
        .mockResolvedValueOnce({
          transactions: [spamTx],
          nextPageToken: 'page2',
        })
        .mockResolvedValueOnce({
          transactions: Array(15).fill(legitimateTx),
        });

      jest
        .mocked(tokenPricesServiceMock.getPriceChangesData)
        .mockResolvedValue({
          'eip155:43114-0xspamtoken': { currentPrice: 0.001, platforms: {} },
          'eip155:43114-0xlegittoken': { currentPrice: 50, platforms: {} },
        });

      jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
        getTransactionHistory: getTransactionHistoryMock,
      });

      const result = await service.getTxHistory(evmNetwork);

      expect(getTransactionHistoryMock).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(15);
    });

    it('should stop paginating when MAX_FETCH_PAGES is reached', async () => {
      const getTransactionHistoryMock = jest.fn().mockResolvedValue({
        transactions: [spamTx],
        nextPageToken: 'next',
      });

      jest
        .mocked(tokenPricesServiceMock.getPriceChangesData)
        .mockResolvedValue({
          'eip155:43114-0xspamtoken': { currentPrice: 0.001, platforms: {} },
        });

      jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
        getTransactionHistory: getTransactionHistoryMock,
      });

      const result = await service.getTxHistory(evmNetwork);

      expect(getTransactionHistoryMock).toHaveBeenCalledTimes(5);
      expect(result).toHaveLength(0);
    });

    it('should stop paginating when there is no nextPageToken', async () => {
      const getTransactionHistoryMock = jest.fn().mockResolvedValue({
        transactions: [spamTx],
      });

      jest
        .mocked(tokenPricesServiceMock.getPriceChangesData)
        .mockResolvedValue({
          'eip155:43114-0xspamtoken': { currentPrice: 0.001, platforms: {} },
        });

      jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
        getTransactionHistory: getTransactionHistoryMock,
      });

      const result = await service.getTxHistory(evmNetwork);

      expect(getTransactionHistoryMock).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(0);
    });

    it('should keep NFT transactions regardless of amount', async () => {
      const nftTx = {
        ...txHistoryItem,
        tokens: [
          {
            name: 'CoolNFT',
            symbol: 'NFT',
            amount: '1',
            type: TokenType.ERC721,
            address: '0xnftcontract',
          },
        ],
      };

      jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
        getTransactionHistory: jest.fn().mockResolvedValue({
          transactions: [nftTx],
        }),
      });

      const result = await service.getTxHistory(evmNetwork);

      expect(result).toHaveLength(1);
      expect(result[0]?.tokens[0]?.symbol).toBe('NFT');
    });

    it('should not filter any transactions on testnet networks', async () => {
      const testnetNetwork = {
        ...evmNetwork,
        isTestnet: true,
      };

      jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
        getTransactionHistory: jest.fn().mockResolvedValue({
          transactions: [spamTx, legitimateTx],
        }),
      });

      const result = await service.getTxHistory(testnetNetwork);

      expect(result).toHaveLength(2);
      expect(tokenPricesServiceMock.getPriceChangesData).not.toHaveBeenCalled();
    });

    it('should fetch price data in parallel with first page', async () => {
      jest.mocked(moduleManagereMock.loadModuleByNetwork).mockResolvedValue({
        getTransactionHistory: jest.fn().mockResolvedValue({
          transactions: [legitimateTx],
        }),
      });

      await service.getTxHistory(evmNetwork);

      expect(tokenPricesServiceMock.getPriceChangesData).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
