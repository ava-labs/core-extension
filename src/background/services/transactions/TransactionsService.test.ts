import { NetworkVMType } from '@avalabs/chains-sdk';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { BigNumber } from 'ethers';
import { AccountsService } from '../accounts/AccountsService';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { BalancesService } from '../balances/BalancesService';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { StorageService } from '../storage/StorageService';
import { TransactionsService } from './TransactionsService';
import { txParams } from './models';
import { LockService } from '../lock/LockService';

jest.mock('../lock/LockService');
import { getTxInfo } from './getTxInfo';
import { isTxDescriptionError } from './getTxInfo';

jest.mock('./getTxInfo', () => ({
  getTxInfo: jest.fn(),
  isTxDescriptionError: jest.fn(),
}));

const buildMessage = (
  params: Partial<txParams>
): ExtensionConnectionMessage => ({
  method: 'eth_sendTransaction',
  id: Math.floor(1_000_000 * Math.random()).toString(),
  params: [params],
});

const gweiToBig = (gwei: number) =>
  BigNumber.from(`0x${(gwei * 1e9).toString(16)}`);

const mockedFees = {
  displayDecimals: 9, // gwei
  low: { maxFee: gweiToBig(30), maxTip: gweiToBig(1) },
  medium: { maxFee: gweiToBig(33), maxTip: gweiToBig(1.5) },
  high: { maxFee: gweiToBig(36), maxTip: gweiToBig(2) },
  isFixedFee: false,
};

describe('background/services/transactions/TransactionsService.ts', () => {
  let storageService: StorageService;
  let networkService: NetworkService;
  let networkFeeService: NetworkFeeService;
  let balanceAggregatorService: BalanceAggregatorService;
  let accountsService: AccountsService;
  let featureFlagService: FeatureFlagService;

  let service: TransactionsService;

  const lockService = new LockService({} as any, {} as any);

  beforeEach(() => {
    storageService = {
      save: jest.fn(),
      load: jest.fn(),
      saveToSessionStorage: jest.fn(),
      loadFromSessionStorage: jest.fn(),
    } as any;
    networkService = new NetworkService({} as any, {} as any);
    networkFeeService = new NetworkFeeService(networkService);
    accountsService = new AccountsService({} as any, {} as any, networkService);

    const accountName = 'testAccount';
    const addListenerMock = jest.fn();
    const accountsServiceMock = {
      activeAccount: { addressC: accountName },
      addListener: addListenerMock,
    } as unknown as AccountsService;

    balanceAggregatorService = new BalanceAggregatorService(
      {} as BalancesService,
      networkService,
      lockService,
      storageService,
      accountsServiceMock
    );
    featureFlagService = { addListner: jest.fn() } as any;

    // @ts-expect-error activeNetwork setter is private
    networkService.activeNetwork = {
      chainId: 1,
      vmName: NetworkVMType.EVM,
      networkToken: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    } as any;

    const provider = {
      getCode: jest.fn().mockResolvedValue('0x'),
      getTransactionCount: jest.fn().mockReturnValue(3), // dummy nonce
      estimateGas: jest.fn().mockResolvedValue(BigNumber.from(21000)), // dummy gas limit
    } as any;
    jest
      .spyOn(networkService, 'getProviderForNetwork')
      .mockReturnValue(provider);
    jest
      .spyOn(networkFeeService, 'getNetworkFee')
      .mockResolvedValue(mockedFees);

    service = new TransactionsService(
      storageService,
      networkService,
      networkFeeService,
      balanceAggregatorService,
      accountsService,
      featureFlagService
    );

    jest.spyOn(service, 'saveTransactions');
  });

  describe('addTransaction() method', () => {
    describe('when transaction payload does not specify a type', () => {
      it('sets type to "2" (EIP-1559)', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });
        await service.addTransaction(message);

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            txParams: expect.objectContaining({
              type: 2,
            }),
          }),
        });
      });
    });

    describe('when transaction payload specifies a type lower than EIP-1559 (2)', () => {
      it('upgrades the transaction to EIP-1559 type', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          type: 0,
        });
        await service.addTransaction(message);

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            txParams: expect.objectContaining({
              type: 2,
            }),
          }),
        });
      });
    });

    describe('when transaction payload specifies a type higher than EIP-1559 (2)', () => {
      it('does not downgrade it', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          type: 3,
        });
        await service.addTransaction(message);

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            txParams: expect.objectContaining({
              type: 3,
            }),
          }),
        });
      });
    });

    describe('when dApp suggests a gas limit', () => {
      const params = {
        from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
        to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
        value: '0x5af3107a4000',
        gas: 1337,
      };

      const message = buildMessage(params);

      it('uses the suggested gas limit', async () => {
        await service.addTransaction(message);

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            txParams: expect.objectContaining({
              gas: 1337,
            }),
          }),
        });
      });
    });

    describe('when dApp does not suggest a gas limit', () => {
      const params = {
        from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
        to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
        value: '0x5af3107a4000',
      };

      const message = buildMessage(params);

      it('uses an estimation provided by network fee service', async () => {
        jest
          .spyOn(networkFeeService, 'estimateGasLimit')
          .mockResolvedValue(12345);

        await service.addTransaction(message);

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            txParams: expect.objectContaining({
              gas: 12345,
            }),
          }),
        });
      });
    });

    it('persists actual current fees', async () => {
      const message = buildMessage({
        from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
        to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
        value: '0x5af3107a4000',
      });
      await service.addTransaction(message);

      expect(service.saveTransactions).toHaveBeenCalledWith({
        [message.id]: expect.objectContaining({
          displayValues: expect.objectContaining({
            maxFeePerGas: mockedFees.low.maxFee,
          }),
        }),
      });
    });

    describe('when parsing a transaction', () => {
      it('does not load contract info for contract deployments', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '',
          value: '0x5af3107a4000',
          data: '0x123123123123',
        });
        await service.addTransaction(message);
        const provider: any = networkService.getProviderForNetwork({} as any);

        expect(provider.getCode).not.toHaveBeenCalled();

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            txParams: expect.objectContaining({
              data: '0x123123123123',
              from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
              to: '',
              type: 2,
              value: '0x5af3107a4000',
            }),
          }),
        });
      });

      it('loads contract info', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x213B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          data: '0x123123123123',
        });
        const txInfo = {
          name: 'deposit',
          args: [{}],
        };

        const provider: any = networkService.getProviderForNetwork({} as any);
        (provider.getCode as jest.Mock).mockResolvedValue('0x1234');
        (getTxInfo as jest.Mock).mockResolvedValue(txInfo);
        (isTxDescriptionError as unknown as jest.Mock).mockReturnValue(txInfo);

        await service.addTransaction(message);

        expect(provider.getCode).toHaveBeenCalledTimes(1);
        expect(provider.getCode).toHaveBeenCalledWith(
          '0x213b6494e2632ec1c9f90ce05327e96e30767638'
        );

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            displayValues: expect.objectContaining({
              description: txInfo,
            }),
            txParams: expect.objectContaining({
              data: '0x123123123123',
              from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
              to: '0x213B6494E2632ec1c9F90Ce05327e96e30767638',
              type: 2,
              value: '0x5af3107a4000',
            }),
          }),
        });
      });

      it('handles contract info request errors', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x213B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          data: '0x123123123123',
        });
        const txInfo = {
          name: 'deposit',
          args: [{}],
        };

        const provider: any = networkService.getProviderForNetwork({} as any);
        (provider.getCode as jest.Mock).mockRejectedValue(
          new Error('parsing error')
        );
        (getTxInfo as jest.Mock).mockResolvedValue(txInfo);
        (isTxDescriptionError as unknown as jest.Mock).mockReturnValue(txInfo);

        await service.addTransaction(message);

        expect(provider.getCode).toHaveBeenCalledTimes(1);
        expect(provider.getCode).toHaveBeenCalledWith(
          '0x213b6494e2632ec1c9f90ce05327e96e30767638'
        );

        expect(service.saveTransactions).toHaveBeenCalledWith({
          [message.id]: expect.objectContaining({
            displayValues: expect.not.objectContaining({
              description: txInfo,
            }),
            txParams: expect.objectContaining({
              data: '0x123123123123',
              from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
              to: '0x213B6494E2632ec1c9F90Ce05327e96e30767638',
              type: 2,
              value: '0x5af3107a4000',
            }),
          }),
        });
      });
    });
  });
});
