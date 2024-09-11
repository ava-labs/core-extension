import { ChainId, NetworkToken, NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  CurrencyCode,
  Erc20Token,
  Erc20TransferDetails,
  InternalTransactionOpCall,
  NativeTransaction,
  TransactionDetails,
  Glacier,
  TransactionMethodType,
} from '@avalabs/glacier-sdk';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { AccountType } from '../accounts/models';
import { HistoryServiceGlacier } from './HistoryServiceGlacier';
import { HistoryItemCategories } from './models';
import { getSmallImageForNFT } from '../balances/nft/utils/getSmallImageForNFT';
import { getNftMetadata } from '@src/utils/getNftMetadata';
import { TokenType } from '../balances/models';
import { TransactionType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '../network/models';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';

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

const mockedModuleManager = {
  state: { addresses: [] },
} as unknown as ModuleManager;

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

const network: NetworkWithCaipId = {
  primaryColor: 'blue',
  chainName: 'network chain',
  chainId: 123,
  vmName: NetworkVMType.EVM,
  rpcUrl: 'network.rpc.url',
  explorerUrl: 'https://explorer.url',
  networkToken: networkToken,
  logoUri: 'network.logo.uri',
  caipId: 'caipId',
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
        mockedUnifiedBridgeService,
        mockedModuleManager
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
        mockedUnifiedBridgeService,
        mockedModuleManager
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
        mockedUnifiedBridgeService,
        mockedModuleManager
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
        mockedUnifiedBridgeService,
        mockedModuleManager
      ) as any;
      const result = service.getAddress(ChainId.BITCOIN);
      expect(result).toEqual(btcAddress);

      const result2 = service.getAddress(ChainId.BITCOIN_TESTNET);
      expect(result2).toEqual(btcAddress);
    });

    it('should return C Address when param is non-BTC network ID', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService,
        mockedModuleManager
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
        mockedUnifiedBridgeService,
        mockedModuleManager
      ) as any;
      const result = service.parseRawMethod('approve(address,uint256)');
      expect(result).toEqual('Approve');
    });
    it('should return empty string if no method name was provided', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService,
        mockedModuleManager
      ) as any;
      const result = service.parseRawMethod();
      expect(result).toEqual('');
    });
    it('should return provided method name if open parentheses is not in method name', () => {
      const service = new HistoryServiceGlacier(
        mockedAccountsService,
        mockedUnifiedBridgeService,
        mockedModuleManager
      ) as any;
      const methodName = 'Hello!';
      const result = service.parseRawMethod(methodName);
      expect(result).toEqual(methodName);
    });
  });
});
