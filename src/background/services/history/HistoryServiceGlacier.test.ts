import {
  ChainId,
  Network,
  NetworkToken,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import {
  CurrencyCode,
  Erc20Token,
  Erc20TransferDetails,
  NftTokenMetadataStatus,
  Erc721Token,
  Erc721TransferDetails,
  InternalTransactionOpCall,
  NativeTransaction,
  TransactionDetails,
  Glacier,
  TransactionMethodType,
} from '@avalabs/glacier-sdk';
import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { AccountType } from '../accounts/models';
import { HistoryServiceGlacier } from './HistoryServiceGlacier';
import { TransactionType, HistoryItemCategories } from './models';
import { getSmallImageForNFT } from '../balances/nft/utils/getSmallImageForNFT';
import { getNftMetadata } from '@src/utils/getNftMetadata';
import { TokenType } from '../balances/models';

jest.mock('@src/utils/getExplorerAddress', () => ({
  getExplorerAddressByNetwork: jest.fn(),
}));

jest.mock('@avalabs/glacier-sdk', () => ({
  Glacier: jest.fn(),
  CurrencyCode: {
    Usd: 'usd',
  },
  NftTokenMetadataStatus: {
    UNKNOWN: 'UNKNOWN',
  },
  InternalTransactionOpCall: {
    UNKNOWN: 'UNKNOWN',
  },
  TransactionMethodType: {
    NATIVE_TRANSFER: 'NATIVE_TRANSFER',
  },
  Erc20Token: {
    ercType: {
      ERC_20: 'ERC-20',
    },
  },
  Erc721Token: {
    ercType: {
      ERC_721: 'ERC-721',
    },
  },
}));

jest.mock('@src/utils/getNftMetadata', () => ({
  getNftMetadata: jest.fn(),
}));

jest.mock('../balances/nft/utils/getSmallImageForNFT', () => ({
  getSmallImageForNFT: jest.fn(),
}));
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
const mockedUnifiedBridgeService = {
  state: { addresses: [] },
} as any;

const senderAddress = 'Sender Address';

const tokenInfo: Erc20TransferDetails = {
  from: { address: senderAddress },
  to: { address: userAddress },
  value: '100000000000000',
  erc20Token: {
    ercType: Erc20Token.ercType.ERC_20,
    address: 'erc20 Token address',
    decimals: 18,
    name: 'ERC20 Token',
    price: { value: 1000000, currencyCode: CurrencyCode.USD },
    symbol: 'E20T',
  },
  logIndex: 1,
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
    callType: TransactionMethodType.NATIVE_TRANSFER,
    methodName: 'transfer(address,uint256)',
  },
  value: '0',
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
      callType: TransactionMethodType.NATIVE_TRANSFER,
      methodName: 'transfer(address,uint256)',
    },
    value: '0',
  },
};

const networkToken: NetworkToken = {
  name: 'network token',
  symbol: 'NWT',
  description: 'This is network token.',
  decimals: 20,
  logoUri: 'network.token.logo.uri',
};

const network: Network = {
  primaryColor: 'blue',
  chainName: 'network chain',
  chainId: 123,
  vmName: NetworkVMType.EVM,
  rpcUrl: 'network.rpc.url',
  explorerUrl: 'https://explorer.url',
  networkToken: networkToken,
  logoUri: 'network.logo.uri',
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
  from: senderAddress,
  to: userAddress,
  tokens: [
    {
      decimal: tokenInfo.erc20Token.decimals.toString(),
      name: tokenInfo.erc20Token.name,
      symbol: tokenInfo.erc20Token.symbol,
      amount: '0.0001',
      from: { address: senderAddress },
      to: { address: userAddress },
      type: TokenType.ERC20,
    },
  ],
  gasPrice: detailsForTransfer.nativeTransaction.gasPrice,
  gasUsed: detailsForTransfer.nativeTransaction.gasUsed,
  explorerLink: `test.com/${nativeTx.txHash}`,
  chainId: network.chainId.toString(),
  type: TransactionType.TRANSFER,
};

const imageUri = 'erc721.image.com';
const smallImageUri = 'erc721.small.image.com';

const erc20Token1: Erc20Token = {
  address: '0x7777777777',
  name: 'Erc20 Token 1',
  symbol: 'E20T1',
  decimals: 20,
  logoUri: 'erc20.one.com',
  ercType: Erc20Token.ercType.ERC_20,
  price: {
    currencyCode: CurrencyCode.USD,
    value: 100,
  },
};

const erc721Token1: Erc721Token = {
  address: '0x8888888888',
  name: 'Erc721 Token 1',
  symbol: 'E721T1',
  tokenId: '123',
  tokenUri: 'erc721.one.com',
  ercType: Erc721Token.ercType.ERC_721,
  metadata: {
    indexStatus: NftTokenMetadataStatus.UNINDEXED,
    imageUri: imageUri,
  },
};
const erc721TokenWithNoImageUri: Erc721Token = {
  address: '0x123123123123123',
  name: 'Erc721 Token no Image',
  symbol: 'E721T2',
  tokenId: '789',
  tokenUri: 'erc721.no.image.com',
  ercType: Erc721Token.ercType.ERC_721,
  metadata: {
    indexStatus: NftTokenMetadataStatus.UNINDEXED,
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
  logIndex: 2,
};

const erc721Tx: Erc721TransferDetails = {
  from: {
    address: '0x5555555555',
  },
  to: {
    address: '0x6666666666',
  },
  erc721Token: erc721Token1,
  logIndex: 3,
};

const txDetails1: TransactionDetails = {
  nativeTransaction: nativeTx,
};

const erc20TxWithUserAddress1: Erc20TransferDetails = {
  ...erc20Tx,
  from: {
    address: userAddress,
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
      gasLimit: '0',
      gasUsed: '21600',
    },
  ],
};

const detailsForFailedTransaction: TransactionDetails = {
  nativeTransaction: { ...nativeTx, txStatus: '0' },
  erc20Transfers: [erc20TxWithUserAddress1],
};

describe('background/services/history/HistoryServiceGlacier.test.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (getExplorerAddressByNetwork as jest.Mock).mockImplementation((_, hash) => {
      return `test.com/${hash}`;
    });
    (getNftMetadata as jest.Mock).mockImplementation(() =>
      Promise.resolve({ image: imageUri })
    );
    (getSmallImageForNFT as jest.Mock).mockImplementation(() =>
      Promise.resolve(smallImageUri)
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
    (Glacier as jest.Mock).mockImplementation(() => {
      return {
        evmTransactions: {
          listTransactions: mockedListTransactions,
        },
      };
    });
  });
  describe('getHistory', () => {
    it('should return an empty array if account is missing', async () => {
      const service = new HistoryServiceGlacier(
        {} as any,
        mockedUnifiedBridgeService
      );
      try {
        const result = await service.getHistory(network);
        expect(result).toStrictEqual([]);
      } catch (error) {
        fail(error);
      }
    });

    it('should return an empty array on error', async () => {
      const mockedError = new Error('some error');
      (Glacier as jest.Mock).mockImplementationOnce(() => {
        return {
          listTransactions: jest.fn().mockRejectedValue(mockedError),
        };
      });
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      );
      try {
        const result = await service.getHistory(network);
        expect(result).toStrictEqual([]);
      } catch (e) {
        fail(e);
      }
    });

    it('should return expected results', async () => {
      // detailsWithInternalTransactions, detailsForFailedTransaction, and txDetails1 should be filtered
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      );
      try {
        const result = await service.getHistory(network);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(txHistoryItem);
      } catch (error) {
        fail(error);
      }
    });
  });

  describe('getAddress', () => {
    it('should return btc Address when param is BTC network ID', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getAddress(ChainId.BITCOIN);
      expect(result).toEqual(btcAddress);

      const result2 = service.getAddress(ChainId.BITCOIN_TESTNET);
      expect(result2).toEqual(btcAddress);
    });

    it('should return C Address when param is non-BTC network ID', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const networks = [
        ChainId.AVALANCHE_MAINNET_ID,
        ChainId.AVALANCHE_TESTNET_ID,
        ChainId.AVALANCHE_LOCAL_ID,
        ChainId.ETHEREUM_HOMESTEAD,
        ChainId.ETHEREUM_TEST_RINKEBY,
        ChainId.ETHEREUM_TEST_GOERLY,
        ChainId.ETHEREUM_TEST_SEPOLIA,
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
    it('should return method name with startCase', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.parseRawMethod('approve(address,uint256)');
      expect(result).toEqual('Approve');
    });
    it('should return empty string if no method name was provided', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.parseRawMethod();
      expect(result).toEqual('');
    });
    it('should return provided method name if open parentheses is not in method name', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const methodName = 'Hello!';
      const result = service.parseRawMethod(methodName);
      expect(result).toEqual(methodName);
    });
  });

  describe('getHistoryItemCategories', () => {
    it('should return isBridge as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isBridge).toBeFalsy();
    });
    it('should return isBridge as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;

      const bridgeTx = {
        ...txDetails1,
        erc20Transfers: [{ ...erc20Tx, from: { address: ETHEREUM_ADDRESS } }],
      };
      const result = service.getHistoryItemCategories(bridgeTx, userAddress);
      expect(result.isBridge).toBeTruthy();
      expect(result.type).toEqual(TransactionType.BRIDGE);
      expect(result.isContractCall).toBeFalsy();
    });
    it('should return isSwap as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isSwap).toBeFalsy();
    });
    it('should return isSwap as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isNativeSend as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isNativeSend as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isNativeReceive as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isNativeReceive as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isNFTPurchase as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isNFTPurchase).toBeFalsy();
    });
    it('should return isNFTPurchase as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isApprove as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isApprove).toBeFalsy();
    });
    it('should return isApprove as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isTransfer as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isTransfer as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isTransfer).toBeTruthy();
      expect(result.type).toEqual(TransactionType.TRANSFER);
      expect(result.isContractCall).toBeFalsy();
    });
    it('should return isAirdrop as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isAirdrop).toBeFalsy();
    });
    it('should return isAirdrop as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isUnwrap as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isUnwrap).toBeFalsy();
    });
    it('should return isUnwrap as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isFillOrder as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getHistoryItemCategories(txDetails1, userAddress);
      expect(result.isFillOrder).toBeFalsy();
    });
    it('should return isFillOrder as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isOutgoing as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getSenderInfo(
        historyItemCategories,
        txDetails1,
        userAddress
      );
      expect(result.isOutgoing).toBeFalsy();
    });
    it('should return isOutgoing as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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

    it('should return isIncoming as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getSenderInfo(
        historyItemCategories,
        txDetails1,
        userAddress
      );
      expect(result.isIncoming).toBeFalsy();
    });
    it('should return isIncoming as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return isSender as false', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = service.getSenderInfo(
        historyItemCategories,
        txDetails1,
        userAddress
      );
      expect(result.isSender).toBeFalsy();
    });
    it('should return isSender as true', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
    it('should return expected from and to', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
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
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = await service.getTokens(txDetails1, network, userAddress);
      expect(result.length).toEqual(0);
    });
    it('should return expected nativeToken info when nativeTransaction has a value', async () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const nativeTxWithValue = {
        ...nativeTx,
        value: '100000000000000000000',
      };
      const details: TransactionDetails = {
        nativeTransaction: nativeTxWithValue,
      };

      const result = await service.getTokens(details, network, userAddress);

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        decimal: network.networkToken.decimals.toString(),
        name: network.networkToken.name,
        symbol: network.networkToken.symbol,
        amount: '1',
        from: nativeTx.from,
        to: nativeTx.to,
        type: TokenType.NATIVE,
      });
    });

    it('should return token info from erc20Transfer', async () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = await service.getTokens(
        { ...txDetails1, erc20Transfers: [erc20Tx] },
        network,
        userAddress
      );

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        decimal: erc20Tx.erc20Token.decimals.toString(),
        name: erc20Tx.erc20Token.name,
        symbol: erc20Tx.erc20Token.symbol,
        amount: '0.00000000000000000002',
        from: erc20Tx.from,
        to: erc20Tx.to,
        imageUri: 'erc20.one.com',
        type: TokenType.ERC20,
      });
    });

    it('should return token info from erc721Transfer', async () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = await service.getTokens(
        { ...txDetails1, erc721Transfers: [erc721Tx] },
        network,
        userAddress
      );

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        name: erc721Tx.erc721Token.name,
        symbol: erc721Tx.erc721Token.symbol,
        amount: '1',
        from: erc721Tx.from,
        to: erc721Tx.to,
        collectableTokenId: erc721Token1.tokenId,
        imageUri,
        type: TokenType.ERC721,
      });
    });

    it('should return token info with imageUri from fetched metadata', async () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;

      const result = await service.getTokens(
        {
          ...txDetails1,
          erc721Transfers: [
            { ...erc721Tx, erc721Token: erc721TokenWithNoImageUri },
          ],
        },
        network,
        userAddress
      );
      expect(getNftMetadata).toBeCalledTimes(1);
      expect(getSmallImageForNFT).toBeCalledTimes(1);
      expect(getSmallImageForNFT).toBeCalledWith(imageUri);

      expect(result.length).toEqual(1);
      expect(result[0].imageUri).toEqual(smallImageUri);
    });

    it('should return token info with empty imageUri if fails to fetch metadata', async () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;

      (getNftMetadata as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Failed to fetch metadata'))
      );

      const result = await service.getTokens(
        {
          ...txDetails1,
          erc721Transfers: [
            { ...erc721Tx, erc721Token: erc721TokenWithNoImageUri },
          ],
        },
        network,
        userAddress
      );
      expect(getNftMetadata).toBeCalledTimes(1);

      expect(result.length).toEqual(1);
      expect(result[0].imageUri).toEqual('');
    });
  });

  describe('convertToTxHistoryItem', () => {
    it('should return expected value', async () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService
      ) as any;
      const result = await service.convertToTxHistoryItem(
        detailsForTransfer,
        network,
        userAddress
      );
      expect(result).toEqual(txHistoryItem);
    });
  });
});
