import {
  ChainId,
  Network,
  NetworkToken,
  NetworkVMType,
} from '@avalabs/chains-sdk';
import {
  CurrencyCode,
  Erc20Token,
  Erc20TransferDetails,
  Erc721MetadataStatus,
  Erc721Token,
  Erc721TransferDetails,
  InternalTransactionOpCall,
  NativeTransaction,
  TransactionDetails,
  GlacierClient,
} from '@avalabs/glacier-sdk';
import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { AccountType } from '../accounts/models';
import { HistoryServiceGlacier } from './HistoryServiceGlacier';
import { TransactionType, HistoryItemCategories } from './models';

jest.mock('@src/utils/getExplorerAddress', () => ({
  getExplorerAddressByNetwork: jest.fn(),
}));

jest.mock('@avalabs/glacier-sdk', () => ({
  GlacierClient: jest.fn(),
  CurrencyCode: {
    Usd: 'usd',
  },
  Erc721MetadataStatus: {
    UNKNOWN: 'UNKNOWN',
  },
  InternalTransactionOpCall: {
    UNKNOWN: 'UNKNOWN',
  },
}));

describe('background/services/history/HistoryServiceGlacier.test.ts', () => {
  const btcAddress = 'bc1111111111';
  const userAddress = '0xaaaaaaaaaa';

  const mockedAccountsService = {
    activeAccount: {
      index: 0,
      name: 'test name',
      type: AccountType.PRIMARY,
      addressBTC: btcAddress,
      addressC: userAddress,
    },
  } as any;

  const erc20Token1: Erc20Token = {
    address: '0x7777777777',
    name: 'Erc20 Token 1',
    symbol: 'E20T1',
    decimals: 20,
    logoUri: 'erc20.one.com',
    price: {
      currencyCode: CurrencyCode.Usd,
      value: 100,
    },
  };

  const erc721Token1: Erc721Token = {
    address: '0x8888888888',
    name: 'Erc721 Token 1',
    symbol: 'E721T1',
    tokenId: '123',
    tokenUri: 'erc721.one.com',
    metadata: {
      indexStatus: Erc721MetadataStatus.UNINDEXED,
    },
  };

  const erc20Tx: Erc20TransferDetails = {
    from: {
      address: '0x3333333333',
    },
    to: {
      address: '0x4444444444',
    },
    erc20Token: erc20Token1,
    value: '2',
  };

  const erc721Tx: Erc721TransferDetails = {
    from: {
      address: '0x5555555555',
    },
    to: {
      address: '0x6666666666',
    },
    erc721Token: erc721Token1,
  };

  const nativeTx: NativeTransaction = {
    blockNumber: '339',
    blockTimestamp: 1648672486,
    blockHash: '0X9999999999',
    blockIndex: 0,
    txHash: '0x1010101010',
    txStatus: '1',
    txType: 1,
    gasLimit: '51373',
    gasUsed: '51373',
    gasPrice: '470000000000',
    nonce: '1',
    from: {
      address: '0x1212121212',
    },
    to: {
      address: '0x1313131313',
    },
    method: {
      methodHash: '0xa9059cbb',
      methodName: 'transfer(address,uint256)',
    },
    value: '0',
  };

  const txDetails1: TransactionDetails = {
    nativeTransaction: nativeTx,
  };

  const historyItemCategories: HistoryItemCategories = {
    isBridge: false,
    isSwap: false,
    isNativeSend: false,
    isNativeReceive: false,
    isNFTPurchase: false,
    isApprove: false,
    isTransfer: false,
    isAirdrop: false,
    isUnwrap: false,
    isFillOrder: false,
    isContractCall: false,
    method: 'test',
    type: TransactionType.UNKNOWN,
  };

  const networkToken: NetworkToken = {
    name: 'network token',
    symbol: 'NWT',
    description: 'This is network token.',
    decimals: 20,
    logoUri: 'network.token.logo.uri',
  };

  const network: Network = {
    chainName: 'network chain',
    chainId: 123,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'network.rpc.url',
    networkToken: networkToken,
    logoUri: 'network.logo.uri',
  };

  const erc20TxWithUserAddress1: Erc20TransferDetails = {
    ...erc20Tx,
    from: {
      address: userAddress,
    },
  };

  const senderAddress = 'Sender Address';

  const tokenInfo = {
    from: { address: senderAddress },
    to: { address: userAddress },
    value: '100000000000000',
    erc20Token: {
      address: 'erc20 Token address',
      decimals: 18,
      name: 'ERC20 Token',
      price: { value: 1000000, currencyCode: CurrencyCode.Usd },
      symbol: 'E20T',
    },
  };
  const detailsForTransfer: TransactionDetails = {
    erc20Transfers: [tokenInfo],
    nativeTransaction: {
      blockNumber: '15583097',
      blockTimestamp: 1663779683,
      blockHash: 'txBlockHash',
      blockIndex: 31,
      txHash: '0x1010101010',
      txStatus: '1',
      txType: 1,
      gasLimit: '200000',
      gasUsed: '51606',
      gasPrice: '20743795546',
      nonce: '1',
      from: { address: senderAddress },
      to: {
        address: 'erc20 Token address',
        logoUri: 'erc20 Logo Uri',
        name: 'ERC20 Token',
        symbol: 'E20T',
      },
      method: {
        methodHash: '0xa9059cbb',
        methodName: 'transfer(address,uint256)',
      },
      value: '0',
    },
  };

  const detailsWithInternalTransactions: TransactionDetails = {
    nativeTransaction: nativeTx,
    internalTransactions: [
      {
        from: { address: 'internalFromAddress' },
        to: { address: 'internalToAddress' },
        internalTxType: InternalTransactionOpCall.UNKNOWN,
        value: '10000000000000000000',
        isReverted: false,
      },
    ],
  };

  const detailsForFailedTransaction: TransactionDetails = {
    nativeTransaction: { ...nativeTx, txStatus: '0' },
    erc20Transfers: [erc20TxWithUserAddress1],
  };

  const txHistoryItem = {
    isBridge: false,
    isContractCall: historyItemCategories.isContractCall,
    isIncoming: true,
    isOutgoing: false,
    isSender: false,
    timestamp: new Date(
      detailsForTransfer.nativeTransaction.blockTimestamp * 1000
    ).toISOString(),
    hash: nativeTx.txHash,
    amount: '0.0001',
    from: senderAddress,
    to: userAddress,
    token: {
      decimal: tokenInfo.erc20Token.decimals.toString(),
      name: tokenInfo.erc20Token.name,
      symbol: tokenInfo.erc20Token.symbol,
      amount: '0.0001',
    },
    explorerLink: `test.com/${nativeTx.txHash}`,
    chainId: network.chainId.toString(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    (getExplorerAddressByNetwork as jest.Mock).mockImplementation(
      (network, hash) => {
        return `test.com/${hash}`;
      }
    );
    const mockedListTransactions = jest.fn().mockImplementation(() =>
      Promise.resolve({
        transactions: [
          detailsForTransfer,
          detailsWithInternalTransactions,
          detailsForFailedTransaction,
          txDetails1,
        ],
      })
    );
    (GlacierClient as jest.Mock).mockImplementation(() => {
      return {
        listTransactions: mockedListTransactions,
      };
    });
  });
  describe('getHistory', () => {
    it('should return an empty array if account is missing', async () => {
      const service = new HistoryServiceGlacier({} as any);
      const result = await service.getHistory(network);
      expect(result).toStrictEqual([]);
    });

    it('should return an empty array on error', async () => {
      const error = new Error('some error');
      (GlacierClient as jest.Mock).mockImplementationOnce(() => {
        return {
          listTransactions: jest.fn().mockRejectedValue(error),
        };
      });
      const service = new HistoryServiceGlacier(mockedAccountsService);
      const result = await service.getHistory(network);
      expect(result).toStrictEqual([]);
    });

    it('should return expected results', async () => {
      // detailsWithInternalTransactions, detailsForFailedTransaction, and txDetails1 should be filtered
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = await service.getHistory(network);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(txHistoryItem);
    });
  });

  describe('getAddress', () => {
    it('should return btc Address when param is BTC network ID', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getAddress(ChainId.BITCOIN);
      expect(result).toEqual(btcAddress);

      const result2 = service.getAddress(ChainId.BITCOIN_TESTNET);
      expect(result2).toEqual(btcAddress);
    });

    it('should return C Address when param is non-BTC network ID', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const networks = [
        ChainId.AVALANCHE_MAINNET_ID,
        ChainId.AVALANCHE_TESTNET_ID,
        ChainId.AVALANCHE_LOCAL_ID,
        ChainId.ETHEREUM_HOMESTEAD,
        ChainId.ETHEREUM_TEST_RINKEBY,
        ChainId.ETHEREUM_TEST_GOERLY,
        ChainId.SWIMMER,
        ChainId.SWIMMER_TESTNET,
        ChainId.DFK,
        ChainId.DFK_TESTNET,
        ChainId.WAGMI_TESTNET,
        ChainId.DEXALOT_TESTNET,
      ];
      networks.forEach((networkId) => {
        const result = service.getAddress(networkId);
        expect(result).toEqual(userAddress);
      });
    });
  });

  describe('parseRawMethod', () => {
    it('should return method name with startCase', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.parseRawMethod('approve(address,uint256)');
      expect(result).toEqual('Approve');
    });
    it('should return empty string if no method name was provided', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.parseRawMethod();
      expect(result).toEqual('');
    });
    it('should return provided method name if open parentheses is not in method name', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const methodName = 'Hello!';
      const result = service.parseRawMethod(methodName);
      expect(result).toEqual(methodName);
    });
  });

  describe('getHistoryItemCategories', () => {
    it('should return isBridge as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isBridge).toBeFalsy();
    });
    it('should return isBridge as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;

      const bridgeTx = {
        ...txDetails1,
        erc20Transfers: [{ ...erc20Tx, from: { address: ETHEREUM_ADDRESS } }],
      };
      const result = service.getHistoryItemCategories(bridgeTx, userAddress);
      expect(result.isBridge).toBeTruthy();
      expect(result.type).toEqual(TransactionType.BRIDGE);
      expect(result.isContractCall).toBeFalsy();
    });
    it('should return isSwap as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isSwap).toBeFalsy();
    });
    it('should return isSwap as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const swapNativeTx = {
        ...nativeTx,
        method: {
          methodHash: '0x1414141414',
          methodName: 'simple swap(address,uint256)',
        },
      };
      const swapTx = {
        nativeTransaction: swapNativeTx,
      };
      const result = service.getHistoryItemCategories(swapTx, userAddress);
      expect(result.isSwap).toBeTruthy();
      expect(result.type).toEqual(TransactionType.SWAP);
      expect(result.isContractCall).toBeTruthy();
    });
    it('should return isNativeSend as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isNativeSend).toBeFalsy();
      const sendNativeTx = {
        ...nativeTx,
        from: {
          address: userAddress,
        },
      };
      const sendTx = {
        nativeTransaction: sendNativeTx,
        erc721Transfers: erc721Tx,
      };
      const result2 = service.getHistoryItemCategories(sendTx, userAddress);
      expect(result2.isNativeSend).toBeFalsy();
    });
    it('should return isNativeSend as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const sendNativeTx = {
        ...nativeTx,
        from: {
          address: userAddress,
        },
      };
      const sendTx = {
        nativeTransaction: sendNativeTx,
      };
      const result = service.getHistoryItemCategories(sendTx, userAddress);
      expect(result.isNativeSend).toBeTruthy();
      expect(result.type).toEqual(TransactionType.SEND);
      expect(result.isContractCall).toBeFalsy();
    });
    it('should return isNativeReceive as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isNativeReceive).toBeFalsy();

      const receiveNativeTx = {
        ...nativeTx,
        to: {
          address: userAddress,
        },
      };
      const receiveTx = {
        nativeTransaction: receiveNativeTx,
        erc20Transfers: erc20Tx,
      };
      const result2 = service.getHistoryItemCategories(receiveTx, userAddress);
      expect(result2.isNativeReceive).toBeFalsy();
    });
    it('should return isNativeReceive as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const receiveNativeTx = {
        ...nativeTx,
        to: {
          address: userAddress,
        },
      };
      const receiveTx = {
        nativeTransaction: receiveNativeTx,
      };
      const result = service.getHistoryItemCategories(receiveTx, userAddress);
      expect(result.isNativeReceive).toBeTruthy();
      expect(result.type).toEqual(TransactionType.RECEIVE);
      expect(result.isContractCall).toBeFalsy();
    });
    it('should return isNFTPurchase as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isNFTPurchase).toBeFalsy();
    });
    it('should return isNFTPurchase as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const receiveNativeTx = {
        ...nativeTx,
        method: {
          methodHash: '0x1515151515',
          methodName: 'Market Buy Orders With Eth',
        },
      };
      const receiveTx = {
        nativeTransaction: receiveNativeTx,
      };
      const result = service.getHistoryItemCategories(receiveTx, userAddress);
      expect(result.isNFTPurchase).toBeTruthy();
      expect(result.type).toEqual(TransactionType.NFT_BUY);
      expect(result.isContractCall).toBeTruthy();

      const receiveNativeTx2 = {
        ...nativeTx,
        method: {
          methodHash: '0x1616161616',
          methodName: 'Buy NFT',
        },
      };
      const receiveTx2 = {
        nativeTransaction: receiveNativeTx2,
      };
      const result2 = service.getHistoryItemCategories(receiveTx2, userAddress);
      expect(result2.isNFTPurchase).toBeTruthy();
      expect(result.type).toEqual(TransactionType.NFT_BUY);
      expect(result.isContractCall).toBeTruthy();
    });
    it('should return isApprove as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isApprove).toBeFalsy();
    });
    it('should return isApprove as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const approveNativeTx = {
        ...nativeTx,
        method: {
          methodHash: '0x1717171717',
          methodName: 'Approve',
        },
      };
      const approveTx = {
        nativeTransaction: approveNativeTx,
      };
      const result = service.getHistoryItemCategories(approveTx, userAddress);
      expect(result.isApprove).toBeTruthy();
      expect(result.type).toEqual(TransactionType.APPROVE);
      expect(result.isContractCall).toBeTruthy();
    });
    it('should return isTransfer as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const approveNativeTx = {
        ...nativeTx,
        method: {
          methodHash: '0x1717171717',
          methodName: 'Approve',
        },
      };
      const approveTx = {
        nativeTransaction: approveNativeTx,
      };
      const result = service.getHistoryItemCategories(approveTx, userAddress);
      expect(result.isTransfer).toBeFalsy();
    });
    it('should return isTransfer as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isTransfer).toBeTruthy();
      expect(result.type).toEqual(TransactionType.TRANSFER);
      expect(result.isContractCall).toBeFalsy();
    });
    it('should return isAirdrop as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isAirdrop).toBeFalsy();
    });
    it('should return isAirdrop as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const airdropNativeTx = {
        ...nativeTx,
        method: {
          methodHash: '0x1818181818',
          methodName: 'airdrop',
        },
      };
      const airdropTx = {
        nativeTransaction: airdropNativeTx,
      };
      const result = service.getHistoryItemCategories(airdropTx, userAddress);
      expect(result.isAirdrop).toBeTruthy();
      expect(result.type).toEqual(TransactionType.UNKNOWN);
      expect(result.isContractCall).toBeTruthy();
    });
    it('should return isUnwrap as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isUnwrap).toBeFalsy();
    });
    it('should return isUnwrap as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const unwrapNativeTx = {
        ...nativeTx,
        method: {
          methodHash: '0x1919191919',
          methodName: 'unwrap',
        },
      };
      const unwrapTx = {
        nativeTransaction: unwrapNativeTx,
      };
      const result = service.getHistoryItemCategories(unwrapTx, userAddress);
      expect(result.isUnwrap).toBeTruthy();
      expect(result.type).toEqual(TransactionType.UNKNOWN);
      expect(result.isContractCall).toBeTruthy();
    });
    it('should return isFillOrder as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isFillOrder).toBeFalsy();
    });
    it('should return isFillOrder as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const fillNativeTx = {
        ...nativeTx,
        method: {
          methodHash: '0x1919191919',
          methodName: 'Fill Order',
        },
      };
      const fillTx = {
        nativeTransaction: fillNativeTx,
      };
      const result = service.getHistoryItemCategories(fillTx, userAddress);
      expect(result.isFillOrder).toBeTruthy();
      expect(result.type).toEqual(TransactionType.UNKNOWN);
      expect(result.isContractCall).toBeTruthy();
    });
  });

  describe('getSenderInfo', () => {
    it('should return isOutgoing as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getSenderInfo(
        historyItemCategories,
        txDetails1,
        userAddress
      );
      expect(result.isOutgoing).toBeFalsy();
    });
    it('should return isOutgoing as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const categories = {
        ...historyItemCategories,
        isNativeSend: true,
      };

      const result = service.getSenderInfo(categories, txDetails1, userAddress);
      expect(result.isOutgoing).toBeTruthy();

      const categories2 = {
        ...historyItemCategories,
        isTransfer: true,
      };
      const sendNativeTx = {
        ...nativeTx,
        from: {
          address: userAddress,
        },
      };
      const details = {
        nativeTransaction: sendNativeTx,
      };
      const result2 = service.getSenderInfo(categories2, details, userAddress);
      expect(result2.isOutgoing).toBeTruthy();
    });

    it('should return isIncoming as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getSenderInfo(
        historyItemCategories,
        txDetails1,
        userAddress
      );
      expect(result.isIncoming).toBeFalsy();
    });
    it('should return isIncoming as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const categories = {
        ...historyItemCategories,
        isNativeReceive: true,
      };

      const result = service.getSenderInfo(categories, txDetails1, userAddress);
      expect(result.isIncoming).toBeTruthy();

      const categories2 = {
        ...historyItemCategories,
        isTransfer: true,
      };
      const receiveNativeTx = {
        ...nativeTx,
        to: {
          address: userAddress,
        },
      };
      const details = {
        nativeTransaction: receiveNativeTx,
      };
      const result2 = service.getSenderInfo(categories2, details, userAddress);
      expect(result2.isIncoming).toBeTruthy();
    });
    it('should return isSender as false', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getSenderInfo(
        historyItemCategories,
        txDetails1,
        userAddress
      );
      expect(result.isSender).toBeFalsy();
    });
    it('should return isSender as true', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const sendNativeTx = {
        ...nativeTx,
        from: {
          address: userAddress,
        },
      };
      const details = {
        nativeTransaction: sendNativeTx,
      };

      const result = service.getSenderInfo(
        historyItemCategories,
        details,
        userAddress
      );
      expect(result.isSender).toBeTruthy();
    });
    it('should return expected from and to', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getSenderInfo(
        historyItemCategories,
        txDetails1,
        userAddress
      );
      expect(result.from).toEqual(txDetails1.nativeTransaction.from.address);
      expect(result.to).toEqual(txDetails1.nativeTransaction.to.address);
    });
  });

  describe('getTokens', () => {
    it('should return empty array when no tokens are available', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.getTokens(txDetails1, network, userAddress);
      expect(result.length).toEqual(0);
    });
    it('should return expected nativeToken info when nativeTransaction has a value', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const nativeTxWithValue = {
        ...nativeTx,
        value: '100000000000000000000',
      };
      const details: TransactionDetails = {
        nativeTransaction: nativeTxWithValue,
      };
      const result = service.getTokens(details, network, userAddress);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        decimal: network.networkToken.decimals.toString(),
        name: network.networkToken.name,
        symbol: network.networkToken.symbol,
        amount: '1',
      });
    });

    it('should return token info from erc20Transfer', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const erc20TxWithUserAddress: Erc20TransferDetails = {
        ...erc20Tx,
        from: {
          address: userAddress,
        },
      };
      const result = service.getTokens(
        { ...txDetails1, erc20Transfers: [erc20TxWithUserAddress] },
        network,
        userAddress
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        decimal: erc20TxWithUserAddress.erc20Token.decimals.toString(),
        name: erc20TxWithUserAddress.erc20Token.name,
        symbol: erc20TxWithUserAddress.erc20Token.symbol,
        amount: '0.00000000000000000002',
      });
    });

    it('should return token info from erc721Transfer', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const erc721TxWithUserAddress: Erc721TransferDetails = {
        ...erc721Tx,
        to: {
          address: userAddress,
        },
      };
      const result = service.getTokens(
        { ...txDetails1, erc721Transfers: [erc721TxWithUserAddress] },
        network,
        userAddress
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        name: erc721TxWithUserAddress.erc721Token.name,
        symbol: erc721TxWithUserAddress.erc721Token.symbol,
        amount: '1',
      });
    });
  });

  describe('convertToTxHistoryItem', () => {
    it('should return expected value', async () => {
      const service = new HistoryServiceGlacier(mockedAccountsService) as any;
      const result = service.convertToTxHistoryItem(
        detailsForTransfer,
        network,
        userAddress
      );

      expect(result).toEqual(txHistoryItem);
    });
  });
});
