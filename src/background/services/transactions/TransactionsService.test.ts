import { NetworkContractToken, NetworkVMType } from '@avalabs/chains-sdk';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { AccountsService } from '../accounts/AccountsService';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { StorageService } from '../storage/StorageService';
import { TransactionsService } from './TransactionsService';

import { EthSendTransactionParams } from './handlers/eth_sendTransaction';
import { DebankService } from '../debank';
import { TokenManagerService } from '../tokens/TokenManagerService';
import { AccountType } from '../accounts/models';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import {
  TRANSACTIONS_STORAGE_KEY,
  TransactionDisplayValues,
  TransactionEvent,
  TransactionType,
  TxStatus,
} from './models';
import getTargetNetworkForTx from './utils/getTargetNetworkForTx';
import { parseWithERC20Abi } from './contracts/contractParsers/parseWithERC20Abi';
import { getTxDescription } from './utils/getTxDescription';
import { contractParserMap } from './contracts/contractParsers/contractParserMap';
import { TransactionDescription } from 'ethers';
import { parseBasicDisplayValues } from './contracts/contractParsers/utils/parseBasicDisplayValues';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { isBitcoinNetwork } from '../network/utils/isBitcoinNetwork';
import { encryptAnalyticsData } from '../analytics/utils/encryptAnalyticsData';

jest.mock('../lock/LockService');
jest.mock('../analytics/AnalyticsServicePosthog');
jest.mock('../analytics/utils/encryptAnalyticsData');
jest.mock('../debank');
jest.mock('../tokens/TokenManagerService');
jest.mock('../networkFee/NetworkFeeService');
jest.mock('../network/NetworkService');
jest.mock('../network/utils/isBitcoinNetwork');
jest.mock('../storage/StorageService');
jest.mock('../balances/BalanceAggregatorService');
jest.mock('../featureFlags/FeatureFlagService');
jest.mock('./utils/getTargetNetworkForTx');
jest.mock('./contracts/contractParsers/parseWithERC20Abi');
jest.mock('./utils/getTxDescription');
jest.mock('./contracts/contractParsers/utils/parseBasicDisplayValues');
jest.mock('./contracts/contractParsers/contractParserMap', () => ({
  contractParserMap: new Map([['function', jest.fn()]]),
}));

const buildMessage = (
  params: Partial<EthSendTransactionParams>
): ExtensionConnectionMessage => ({
  method: 'eth_sendTransaction',
  id: Math.floor(1_000_000 * Math.random()).toString(),
  params: [params],
});

const gweiToBig = (gwei: number) => BigInt(`0x${(gwei * 1e9).toString(16)}`);

const mockedFees = {
  displayDecimals: 9, // gwei
  low: { maxFee: gweiToBig(30), maxTip: gweiToBig(1) },
  medium: { maxFee: gweiToBig(33), maxTip: gweiToBig(1.5) },
  high: { maxFee: gweiToBig(36), maxTip: gweiToBig(2) },
  isFixedFee: false,
};

const displayValuesMock: TransactionDisplayValues = {
  fromAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
  gas: {
    maxFeePerGas: 123n,
    gasLimit: 123,
  },
  actions: [
    {
      type: TransactionType.SEND_TOKEN,
      fromAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
      toAddress: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
      token: {
        address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaa',
        decimals: 18,
        symbol: 'TT',
        name: 'Test Token',

        amount: 123123n,
      },
    },
  ],
};

describe('background/services/transactions/TransactionsService.ts', () => {
  const storageService = new StorageService({} as any);
  const networkService = new NetworkService({} as any);
  const networkFeeService = new NetworkFeeService({} as any);
  const balanceAggregatorService = new BalanceAggregatorService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any
  );
  const accountsService = new AccountsService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any
  );
  const featureFlagService = new FeatureFlagService(
    {} as any,
    {} as any,
    {} as any
  );
  const debankService = new DebankService({} as any);
  const tokenManagerService = new TokenManagerService({} as any, {} as any);
  const analyticsServicePosthog = new AnalyticsServicePosthog(
    {} as any,
    {} as any,
    {} as any
  );
  const accountMock = {
    type: AccountType.PRIMARY,
    id: '12',
    name: '',
    addressC: '0x123123123',
    addressBTC: 'tb1123123',
    index: 1,
  };
  const networkMock = {
    chainId: 1,
    vmName: NetworkVMType.EVM,
    chainName: '',
    rpcUrl: '',
    logoUri: '',
    networkToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      description: '',
      logoUri: '',
    },
  };

  const mockedEncryptResult = {
    data: 'testData',
    enc: 'testEnc',
    keyID: 'testKeyId',
  };

  let service: TransactionsService;

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(console, 'info').mockImplementation(() => {});

    jest
      .spyOn(accountsService, 'activeAccount', 'get')
      .mockReturnValue(accountMock);

    jest.mocked(getTargetNetworkForTx).mockResolvedValue(networkMock);

    const provider = new JsonRpcBatchInternal(123);
    jest.spyOn(provider, 'getCode').mockResolvedValue('0x');
    jest.spyOn(provider, 'getTransactionCount').mockResolvedValue(3); // dummy nonce
    jest.spyOn(provider, 'estimateGas').mockResolvedValue(21000n), // dummy gas limit
      jest
        .mocked(networkService)
        .getProviderForNetwork.mockReturnValue(provider);
    jest.mocked(networkFeeService).getNetworkFee.mockResolvedValue(mockedFees);
    jest.mocked(networkFeeService).estimateGasLimit.mockResolvedValue(1234);
    jest.mocked(tokenManagerService).getTokensByChainId.mockResolvedValue([]);
    jest
      .mocked(analyticsServicePosthog)
      .captureEncryptedEvent.mockResolvedValue();
    jest.mocked(isBitcoinNetwork).mockReturnValue(false);
    (encryptAnalyticsData as jest.Mock).mockResolvedValue(mockedEncryptResult);

    service = new TransactionsService(
      storageService,
      networkService,
      networkFeeService,
      balanceAggregatorService,
      accountsService,
      featureFlagService,
      debankService,
      tokenManagerService,
      analyticsServicePosthog
    );
  });

  describe('addTransaction', () => {
    describe('adds gas information', () => {
      it('sets type to "2" (EIP-1559) when not specified', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });
        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                type: 2,
              }),
            }),
          }
        );
      });

      it('upgrades the transaction to EIP-1559 type', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          type: 0,
        });
        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                type: 2,
              }),
            }),
          }
        );
      });

      it('does not downgrade transactions with higher type', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          type: 3,
        });
        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                type: 2,
              }),
            }),
          }
        );
      });

      it('uses the suggested gas limit', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          gas: 1,
        });

        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                gasLimit: '0x1',
              }),
            }),
          }
        );
      });

      it('uses the suggested gas limit from the gasLimit param first', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          gasLimit: '0x123',
          gas: 1337,
        });

        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                gasLimit: '0x123',
              }),
            }),
          }
        );
      });

      it('estimates gasLimit when not provided', async () => {
        jest.mocked(networkFeeService).estimateGasLimit.mockResolvedValue(1);

        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });

        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                gasLimit: '0x1',
              }),
            }),
          }
        );
      });

      it('throws error when gasLimit estimation fails', async () => {
        jest
          .mocked(networkFeeService)
          .estimateGasLimit.mockRejectedValue(new Error('failed request'));

        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });

        await expect(service.addTransaction(message)).rejects.toThrow(
          new Error('failed request')
        );

        expect(storageService.save).not.toHaveBeenCalled();
      });

      it('uses maxFeePerGas and maxPriorityFeePerGas if provided', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          maxFeePerGas: '0x1',
          maxPriorityFeePerGas: '0x543543',
        });

        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                maxFeePerGas: '0x1',
                maxPriorityFeePerGas: '0x543543',
              }),
            }),
          }
        );
      });

      it('adds maxFeePerGas and maxPriorityFeePerGas if missing', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });

        const transactionId = await service.addTransaction(message);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              txParams: expect.objectContaining({
                maxFeePerGas: '0x6fc23ac00',
                maxPriorityFeePerGas: '0x3b9aca00',
              }),
            }),
          }
        );
      });
    });

    describe('parses transaction', () => {
      it('updates balances when active network is different', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '',
          value: '0x5af3107a4000',
          data: '0x123123123123',
          chainId: '0x2',
        });

        jest.mocked(getTargetNetworkForTx).mockResolvedValue({
          ...networkMock,
          chainId: 2,
        });

        jest.mocked(networkService).isActiveNetwork.mockReturnValue(false);

        await service.addTransaction(message);

        expect(networkService.isActiveNetwork).toHaveBeenCalledWith(2);

        expect(
          balanceAggregatorService.updateBalancesForNetworks
        ).toHaveBeenCalledTimes(1);
        expect(
          balanceAggregatorService.updateBalancesForNetworks
        ).toHaveBeenCalledWith([2], [accountMock]);
      });

      it('does not update balances if the target network is active', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '',
          value: '0x5af3107a4000',
          data: '0x123123123123',
        });

        jest.mocked(networkService).isActiveNetwork.mockReturnValue(true);

        await service.addTransaction(message);

        expect(networkService.isActiveNetwork).toHaveBeenCalledWith(1);
        expect(
          balanceAggregatorService.updateBalancesForNetworks
        ).not.toHaveBeenCalled();
      });

      it('parses the transaction with debank', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '',
          value: '0x5af3107a4000',
          data: '0x123123123123',
        });

        jest
          .mocked(debankService.parseTransaction)
          .mockResolvedValue(displayValuesMock);

        const transactionId = await service.addTransaction(message);

        expect(debankService.parseTransaction).toHaveBeenCalledWith(
          networkMock,
          {
            data: '0x123123123123',
            from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
            gasLimit: '0x4d2',
            maxFeePerGas: '0x6fc23ac00',
            maxPriorityFeePerGas: '0x3b9aca00',
            to: '',
            type: 2,
            value: '0x5af3107a4000',
          }
        );
        expect(parseWithERC20Abi).not.toHaveBeenCalled();
        expect(getTxDescription).not.toHaveBeenCalled();

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }
        );
      });

      it('parses the transaction with ERC20 ABI if debank parsing throws error', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0xaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          value: '',
          data: '0x123123123123',
        });
        const mockToken: NetworkContractToken = {
          address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaa',
          decimals: 18,
          name: 'Test Token',
          symbol: 'TT',
          contractType: 'ERC-20',
        };
        jest
          .mocked(tokenManagerService)
          .getTokensByChainId.mockResolvedValue([mockToken]);

        jest.mocked(parseWithERC20Abi).mockReturnValue(displayValuesMock);
        jest
          .mocked(debankService.parseTransaction)
          .mockRejectedValue(new Error('network error'));

        const transactionId = await service.addTransaction(message);

        expect(debankService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).toHaveBeenCalledWith(
          {
            data: '0x123123123123',
            from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
            gasLimit: '0x4d2',
            maxFeePerGas: '0x6fc23ac00',
            maxPriorityFeePerGas: '0x3b9aca00',
            to: '0xaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            type: 2,
            value: '',
          },
          mockToken
        );
        expect(getTxDescription).not.toHaveBeenCalled();

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }
        );
      });

      it('parses the transaction with contract parser map when ERC20 parsing throws an error', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0xaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          value: '',
          data: '0x123123123123',
        });
        jest.mocked(tokenManagerService).getTokensByChainId.mockResolvedValue([
          {
            address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaa',
          } as any,
        ]);

        jest.mocked(parseWithERC20Abi).mockImplementation(() => {
          throw new Error('parsing failed');
        });
        jest
          .mocked(debankService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest
          .mocked(getTxDescription)
          .mockResolvedValue({ name: 'function' } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest.mocked(parser)?.mockResolvedValue(displayValuesMock);

        const transactionId = await service.addTransaction(message);

        expect(debankService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).toHaveBeenCalledTimes(1);
        expect(getTxDescription).toHaveBeenCalledTimes(1);
        expect(parser).toHaveBeenCalledTimes(1);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }
        );
      });

      it('parses the transaction with contract parser map when not a known ERC20 call', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0xaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          value: '',
          data: '0x123123123123',
        });
        jest.mocked(tokenManagerService).getTokensByChainId.mockResolvedValue([
          {
            address: '0xBBBBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaa',
          } as any,
        ]);

        jest
          .mocked(debankService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest
          .mocked(getTxDescription)
          .mockResolvedValue({ name: 'function' } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest.mocked(parser)?.mockResolvedValue(displayValuesMock);

        const transactionId = await service.addTransaction(message);

        expect(debankService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).not.toHaveBeenCalled();
        expect(getTxDescription).toHaveBeenCalledTimes(1);
        expect(parser).toHaveBeenCalledTimes(1);
        expect(parseBasicDisplayValues).not.toHaveBeenCalled();

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }
        );
      });

      it('uses basic display values when parser throws error', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0xaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          value: '',
          data: '0x123123123123',
        });
        jest
          .mocked(debankService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest.mocked(getTxDescription).mockResolvedValue({
          name: 'function',
        } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest.mocked(parser)?.mockRejectedValue(new Error('parsing error'));
        jest
          .mocked(parseBasicDisplayValues)
          .mockResolvedValue(displayValuesMock);

        const transactionId = await service.addTransaction(message);

        expect(debankService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).not.toHaveBeenCalled();
        expect(parser).toHaveBeenCalledTimes(1);
        expect(parseBasicDisplayValues).toHaveBeenCalledTimes(1);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }
        );
      });

      it('uses basic display values when no matching parser found', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0xaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          value: '',
          data: '0x123123123123',
        });
        jest
          .mocked(debankService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest.mocked(getTxDescription).mockResolvedValue({
          name: 'someOtherFunction',
        } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest
          .mocked(parseBasicDisplayValues)
          .mockResolvedValue(displayValuesMock);

        const transactionId = await service.addTransaction(message);

        expect(debankService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).not.toHaveBeenCalled();
        expect(parser).not.toHaveBeenCalled();
        expect(parseBasicDisplayValues).toHaveBeenCalledTimes(1);

        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            [transactionId]: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }
        );
      });

      it('keeps already existing transactions in storage', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0xaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          value: '',
          data: '0x123123123123',
        });
        jest
          .mocked(debankService.parseTransaction)
          .mockResolvedValue(displayValuesMock);

        jest
          .mocked(storageService.load)
          .mockResolvedValue({ tx1: {}, tx2: {} });

        const transactionId = await service.addTransaction(message);

        expect(storageService.load).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY
        );
        expect(storageService.save).toHaveBeenCalledWith(
          TRANSACTIONS_STORAGE_KEY,
          {
            tx1: {},
            tx2: {},
            [transactionId]: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }
        );
      });
    });
  });

  describe('getTransactions', () => {
    it('returns transactions from storage', async () => {
      jest.mocked(storageService.load).mockResolvedValue({ tx1: {}, tx2: {} });

      const transactions = await service.getTransactions();

      expect(storageService.load).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY
      );
      expect(transactions).toEqual({ tx1: {}, tx2: {} });
    });

    it('returns empty object ', async () => {
      jest.mocked(storageService.load).mockResolvedValue(undefined);

      const transactions = await service.getTransactions();

      expect(storageService.load).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY
      );
      expect(transactions).toEqual({});
    });
  });

  describe('saveTransactions', () => {
    it('saves transactions to storage and emits event', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTIONS_UPDATED, subscription);

      await service.saveTransactions({ tx1: {}, tx2: {} } as any);

      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        { tx1: {}, tx2: {} }
      );
      expect(subscription).toHaveBeenCalledTimes(1);
      expect(subscription).toHaveBeenCalledWith({ tx1: {}, tx2: {} });
    });

    it('does not emit event if saving fails', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTIONS_UPDATED, subscription);

      jest
        .mocked(storageService.save)
        .mockRejectedValue(new Error('saving failed'));

      await expect(
        service.saveTransactions({ tx1: {}, tx2: {} } as any)
      ).rejects.toThrow(new Error('saving failed'));

      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        { tx1: {}, tx2: {} }
      );
      expect(subscription).not.toHaveBeenCalled();
    });
  });

  describe('updateTransaction', () => {
    it('does nothing if TX is not found ', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTION_FINALIZED, subscription);
      jest.mocked(storageService.load).mockResolvedValue({
        tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        tx2: { id: 'tx2', displayData: {}, txParams: { type: 1 } },
      });

      await service.updateTransaction({
        id: 'tx3',
        params: {
          type: 2,
          gasLimit: '0x123',
          maxFeePerGas: '0x123',
          from: '0x123',
        },
      });

      expect(storageService.save).not.toHaveBeenCalled();
      expect(subscription).not.toHaveBeenCalled();
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).not.toHaveBeenCalled();
    });

    it('updates transaction parameters', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTION_FINALIZED, subscription);
      jest.mocked(storageService.load).mockResolvedValue({
        tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        tx2: { id: 'tx2', displayData: {}, txParams: { type: 1 } },
      });

      await service.updateTransaction({
        id: 'tx2',
        params: {
          type: 2,
          gasLimit: '0x123',
          maxFeePerGas: '0x123',
          from: '0x123',
        },
      });

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        {
          tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
          tx2: {
            id: 'tx2',
            displayData: {},
            txParams: {
              type: 2,
              gasLimit: '0x123',
              maxFeePerGas: '0x123',
              from: '0x123',
            },
          },
        }
      );
      expect(subscription).not.toHaveBeenCalled();
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).not.toHaveBeenCalled();
    });

    it('updates tx status: TxStatus.SUBMITTING', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTION_FINALIZED, subscription);
      jest.mocked(storageService.load).mockResolvedValue({
        tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        tx2: { id: 'tx2', displayData: {}, txParams: { type: 1 } },
      });

      await service.updateTransaction({
        status: TxStatus.SUBMITTING,
        id: 'tx2',
      });

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        {
          tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
          tx2: {
            id: 'tx2',
            status: TxStatus.SUBMITTING,
            displayData: {},
            txParams: { type: 1 },
          },
        }
      );
      expect(subscription).not.toHaveBeenCalled();
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).not.toHaveBeenCalled();
    });

    it('updates tx status: TxStatus.PENDING', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTION_FINALIZED, subscription);
      jest.mocked(storageService.load).mockResolvedValue({
        tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        tx2: { id: 'tx2', displayData: {}, txParams: { type: 1 } },
      });

      await service.updateTransaction({
        status: TxStatus.PENDING,
        id: 'tx2',
      });

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        {
          tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
          tx2: {
            id: 'tx2',
            displayData: {},
            status: TxStatus.PENDING,
            txParams: { type: 1 },
          },
        }
      );
      expect(subscription).not.toHaveBeenCalled();
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).not.toHaveBeenCalled();
    });

    it('updates tx status: TxStatus.SIGNED', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTION_FINALIZED, subscription);

      const tx2 = {
        id: 'tx2',
        displayData: {},
        txParams: { type: 1 },
        method: 'txMethod',
      };
      jest.mocked(storageService.load).mockResolvedValue({
        tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        tx2,
      });
      // does nothing if no result is present
      await service.updateTransaction({
        status: TxStatus.SIGNED,
        id: 'tx2',
      });
      expect(storageService.save).not.toHaveBeenCalled();
      expect(subscription).not.toHaveBeenCalled();

      await service.updateTransaction({
        status: TxStatus.SIGNED,
        id: 'tx2',
        result: '0x123123',
      });

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        {
          tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        }
      );
      expect(subscription).toHaveBeenCalledTimes(1);
      expect(subscription).toHaveBeenCalledWith({
        status: TxStatus.SIGNED,
        txHash: '0x123123',
        ...tx2,
      });

      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'transactionSuccessful',
          properties: {
            address: accountMock.addressC,
            txHash: '0x123123',
            method: 'txMethod',
          },
        })
      );
    });

    it('updates tx status: TxStatus.ERROR', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTION_FINALIZED, subscription);
      jest.mocked(isBitcoinNetwork).mockReturnValue(true);

      const tx2 = {
        id: 'tx2',
        displayData: {},
        txParams: { type: 1 },
        method: 'tx-method',
      };
      jest.mocked(storageService.load).mockResolvedValue({
        tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        tx2,
      });

      // does nothing if no result is present
      await service.updateTransaction({
        status: TxStatus.ERROR,
        id: 'tx2',
        error: 'Very bad error',
      });

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        {
          tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        }
      );
      expect(subscription).toHaveBeenCalledTimes(1);
      expect(subscription).toHaveBeenCalledWith({
        status: TxStatus.ERROR,
        error: 'Very bad error',
        ...tx2,
      });

      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'transactionFailed',
          properties: { address: accountMock.addressC, method: 'tx-method' },
        })
      );
    });

    it('updates tx status: TxStatus.ERROR_USER_CANCELED', async () => {
      const subscription = jest.fn();
      service.addListener(TransactionEvent.TRANSACTION_FINALIZED, subscription);

      const tx2 = {
        id: 'tx2',
        displayData: {},
        txParams: { type: 1 },
        method: 'test-method',
      };

      jest.mocked(storageService.load).mockResolvedValue({
        tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        tx2,
      });

      // does nothing if no result is present
      await service.updateTransaction({
        status: TxStatus.ERROR_USER_CANCELED,
        id: 'tx2',
      });

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(
        TRANSACTIONS_STORAGE_KEY,
        {
          tx1: { id: 'tx1', displayData: {}, txParams: { type: 1 } },
        }
      );
      expect(subscription).toHaveBeenCalledTimes(1);
      expect(subscription).toHaveBeenCalledWith({
        status: TxStatus.ERROR_USER_CANCELED,
        ...tx2,
      });

      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          name: 'transactionFailed',
          properties: { address: accountMock.addressC, method: 'test-method' },
        })
      );
    });
  });
});
