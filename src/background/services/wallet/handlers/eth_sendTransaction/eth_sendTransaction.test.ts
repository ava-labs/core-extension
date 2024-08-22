import { NetworkService } from '@src/background/services/network/NetworkService';
import { EthSendTransactionHandler } from './eth_sendTransaction';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { BalanceAggregatorService } from '@src/background/services/balances/BalanceAggregatorService';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { TokenManagerService } from '@src/background/services/tokens/TokenManagerService';
import { AnalyticsServicePosthog } from '@src/background/services/analytics/AnalyticsServicePosthog';
import { WalletService } from '@src/background/services/wallet/WalletService';
import {
  EthSendTransactionParams,
  Transaction,
  TransactionDisplayValues,
  TransactionType,
} from './models';
import { ethErrors } from 'eth-rpc-errors';
import { AccountType } from '@src/background/services/accounts/models';
import { NetworkContractToken, NetworkVMType } from '@avalabs/core-chains-sdk';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import getTargetNetworkForTx from './utils/getTargetNetworkForTx';
import { encryptAnalyticsData } from '@src/background/services/analytics/utils/encryptAnalyticsData';
import { getTxDescription } from './utils/getTxDescription';
import { parseWithERC20Abi } from './contracts/contractParsers/parseWithERC20Abi';
import { contractParserMap } from './contracts/contractParsers/contractParserMap';
import { TransactionDescription } from 'ethers';
import { parseBasicDisplayValues } from './contracts/contractParsers/utils/parseBasicDisplayValues';
import { Action, ActionStatus } from '@src/background/services/actions/models';
import browser from 'webextension-polyfill';
import { txToCustomEvmTx } from './utils/txToCustomEvmTx';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { buildRpcCall } from '@src/tests/test-utils';
import { BlockaidService } from '@src/background/services/blockaid/BlockaidService';
import { caipToChainId } from '@src/utils/caipConversion';
import { measureDuration } from '@src/utils/measureDuration';
import { LockService } from '@src/background/services/lock/LockService';

jest.mock('@src/utils/caipConversion');
jest.mock('@src/background/runtime/openApprovalWindow');
jest.mock('@src/utils/network/getProviderForNetwork');
jest.mock('@src/background/services/analytics/AnalyticsServicePosthog');
jest.mock('@src/background/services/tokens/TokenManagerService');
jest.mock('@src/background/services/networkFee/NetworkFeeService');
jest.mock('@src/background/services/network/NetworkService');
jest.mock('@src/background/services/balances/BalanceAggregatorService');
jest.mock('@src/background/services/featureFlags/FeatureFlagService');
jest.mock('@src/background/services/wallet/WalletService');
jest.mock('@src/background/services/lock/LockService');
jest.mock('./utils/getTargetNetworkForTx');
jest.mock('@src/background/services/network/utils/isBitcoinNetwork');
jest.mock('@src/background/services/analytics/utils/encryptAnalyticsData');
jest.mock('./contracts/contractParsers/parseWithERC20Abi');
jest.mock('./utils/getTxDescription');
jest.mock('./contracts/contractParsers/utils/parseBasicDisplayValues');
jest.mock('@src/utils/measureDuration', () => {
  const measureDurationMock = {
    start: jest.fn(),
    end: jest.fn(),
  };
  return {
    measureDuration: () => measureDurationMock,
  };
});
jest.mock('./contracts/contractParsers/contractParserMap', () => ({
  contractParserMap: new Map([['function', jest.fn()]]),
}));
jest.mock('./utils/txToCustomEvmTx');
jest.mock('@src/utils/getExplorerAddress');
jest.mock('webextension-polyfill', () => ({
  notifications: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    onClosed: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    clear: jest.fn(),
  },
  tabs: {
    create: jest.fn(),
  },
  windows: {
    onRemoved: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    onFocusChanged: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
  i18n: {
    getMessage: jest.fn(),
  },
  runtime: {
    id: 'runtime-id',
  },
}));
jest.mock('@blockaid/client', () => {
  return jest.fn();
});

const buildMessage = (params: EthSendTransactionParams) => ({
  method: DAppProviderRequest.ETH_SEND_TX,
  id: Math.floor(1_000_000 * Math.random()).toString(),
  params: [params],
  site: {
    tabId: '1',
  } as any,
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

describe('background/services/wallet/handlers/eth_sendTransaction/eth_sendTransaction.ts', () => {
  const networkService = new NetworkService({} as any, {} as any);
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

  const tokenManagerService = new TokenManagerService({} as any, {} as any);
  const walletService = new WalletService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any
  );
  const analyticsServicePosthog = new AnalyticsServicePosthog(
    {} as any,
    {} as any,
    {} as any
  );
  const blockaidService = new BlockaidService({} as any);
  const lockService = new LockService({} as any, {} as any);

  const accountMock = {
    type: AccountType.PRIMARY,
    id: '12',
    name: '',
    addressC: '0x123123123',
    addressBTC: 'tb1123123',
    index: 1,
    walletId: 'wallet-id',
  };
  const networkMock = {
    chainId: 1,
    caipId: 'eip155:1',
    vmName: NetworkVMType.EVM,
    chainName: '',
    rpcUrl: '',
    explorerUrl: 'https://explorer.url',
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
  let handler: EthSendTransactionHandler;
  let provider: JsonRpcBatchInternal;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.mocked(caipToChainId).mockReturnValue(43114);
    jest.mocked(browser.notifications.clear).mockResolvedValue(true);
    jest
      .spyOn(accountsService, 'activeAccount', 'get')
      .mockReturnValue(accountMock);
    jest.mocked(getTargetNetworkForTx).mockResolvedValue(networkMock);
    provider = new JsonRpcBatchInternal(123);
    jest.spyOn(provider, 'getCode').mockResolvedValue('0x');
    jest.spyOn(provider, 'getTransactionCount').mockResolvedValue(3); // dummy nonce
    jest.spyOn(provider, 'estimateGas').mockResolvedValue(21000n); // dummy gas limit
    jest.spyOn(provider, 'waitForTransaction').mockRejectedValue(new Error());
    jest.mocked(getProviderForNetwork).mockReturnValue(provider);
    jest.mocked(networkFeeService).getNetworkFee.mockResolvedValue(mockedFees);
    jest.mocked(networkFeeService).estimateGasLimit.mockResolvedValue(1234);
    jest.mocked(tokenManagerService).getTokensByChainId.mockResolvedValue([]);
    jest
      .mocked(analyticsServicePosthog)
      .captureEncryptedEvent.mockResolvedValue();
    jest.mocked(isBitcoinNetwork).mockReturnValue(false);
    (encryptAnalyticsData as jest.Mock).mockResolvedValue(mockedEncryptResult);
    jest.mocked(openApprovalWindow).mockResolvedValue(undefined);
    jest.mocked(txToCustomEvmTx).mockReturnValue({
      maxFeePerGas: '0x54',
      maxPriorityFeePerGas: 1n,
      gasLimit: 123,
      data: '0x',
      to: '0x123123',
      from: '0x345',
      value: '0x1',
      type: 2,
    });
    handler = new EthSendTransactionHandler(
      networkService,
      networkFeeService,
      accountsService,
      balanceAggregatorService,
      tokenManagerService,
      walletService,
      analyticsServicePosthog,
      blockaidService,
      lockService
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('handleUnauthenticated', () => {
    it('returns error', async () => {
      const request = {
        id: '123',
        method: 'eth_sendTransaction',
        params: [],
      };
      expect(
        await handler.handleUnauthenticated(buildRpcCall(request))
      ).toStrictEqual({
        ...request,
        error: ethErrors.provider.unauthorized(),
      });
    });
  });

  describe('handleAuthenticated', () => {
    describe('adds gas information', () => {
      it('sets type to "2" (EIP-1559) when not specified', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                type: 2,
              }),
            }),
          }),
          'sign/transaction'
        );
      });
      it('upgrades the transaction to EIP-1559 type', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          type: 0,
        });

        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                type: 2,
              }),
            }),
          }),
          'sign/transaction'
        );
      });
      it('does not downgrade transactions with higher type', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          type: 3,
        });
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                type: 2,
              }),
            }),
          }),
          'sign/transaction'
        );
      });
      it('uses the suggested gas limit', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          gas: 1,
        });

        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                gasLimit: '0x1',
              }),
            }),
          }),
          'sign/transaction'
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

        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                gasLimit: '0x123',
              }),
            }),
          }),
          'sign/transaction'
        );
      });
      it('estimates gasLimit when not provided', async () => {
        jest.mocked(networkFeeService).estimateGasLimit.mockResolvedValue(1);
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });

        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                gasLimit: '0x1',
              }),
            }),
          }),
          'sign/transaction'
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

        await expect(
          handler.handleAuthenticated(buildRpcCall(message))
        ).rejects.toThrow(new Error('failed request'));
        expect(openApprovalWindow).not.toHaveBeenCalled();
      });
      it('uses maxFeePerGas and maxPriorityFeePerGas if provided', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
          maxFeePerGas: '0x1',
          maxPriorityFeePerGas: '0x543543',
        });

        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                maxFeePerGas: '0x1',
                maxPriorityFeePerGas: '0x543543',
              }),
            }),
          }),
          'sign/transaction'
        );
      });
      it('adds maxFeePerGas and maxPriorityFeePerGas if missing', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          value: '0x5af3107a4000',
        });

        await handler.handleAuthenticated(buildRpcCall(message));
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              txParams: expect.objectContaining({
                maxFeePerGas: '0x6fc23ac00',
                maxPriorityFeePerGas: '0x3b9aca00',
              }),
            }),
          }),
          'sign/transaction'
        );
      });
    });
    describe('parses transaction', () => {
      it('updates balances', async () => {
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
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(
          balanceAggregatorService.getBalancesForNetworks
        ).toHaveBeenCalledTimes(1);
        expect(
          balanceAggregatorService.getBalancesForNetworks
        ).toHaveBeenCalledWith([2], [accountMock]);
      });
      it('parses the transaction with blockaid', async () => {
        const message = buildMessage({
          from: '0x473B6494E2632ec1c9F90Ce05327e96e30767638',
          to: '',
          value: '0x5af3107a4000',
          data: '0x123123123123',
        });
        blockaidService.parseTransaction = jest
          .fn()
          .mockResolvedValue(displayValuesMock);
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(blockaidService.parseTransaction).toHaveBeenCalledWith(
          '',
          networkMock,
          {
            chainId: '0xa86a', // 43114
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
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }),
          'sign/transaction'
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
          .mocked(blockaidService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(blockaidService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).toHaveBeenCalledWith(
          {
            chainId: '0xa86a', // 43114
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
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }),
          'sign/transaction'
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
          .mocked(blockaidService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest
          .mocked(getTxDescription)
          .mockResolvedValue({ name: 'function' } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest.mocked(parser)?.mockResolvedValue(displayValuesMock);
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(blockaidService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).toHaveBeenCalledTimes(1);
        expect(getTxDescription).toHaveBeenCalledTimes(1);
        expect(parser).toHaveBeenCalledTimes(1);
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }),
          'sign/transaction'
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
          .mocked(blockaidService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest
          .mocked(getTxDescription)
          .mockResolvedValue({ name: 'function' } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest.mocked(parser)?.mockResolvedValue(displayValuesMock);
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(blockaidService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).not.toHaveBeenCalled();
        expect(getTxDescription).toHaveBeenCalledTimes(1);
        expect(parser).toHaveBeenCalledTimes(1);
        expect(parseBasicDisplayValues).not.toHaveBeenCalled();
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }),
          'sign/transaction'
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
          .mocked(blockaidService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest.mocked(getTxDescription).mockResolvedValue({
          name: 'function',
        } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest.mocked(parser)?.mockRejectedValue(new Error('parsing error'));
        jest
          .mocked(parseBasicDisplayValues)
          .mockResolvedValue(displayValuesMock);
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(blockaidService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).not.toHaveBeenCalled();
        expect(parser).toHaveBeenCalledTimes(1);
        expect(parseBasicDisplayValues).toHaveBeenCalledTimes(1);
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }),
          'sign/transaction'
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
          .mocked(blockaidService.parseTransaction)
          .mockRejectedValue(new Error('network error'));
        jest.mocked(getTxDescription).mockResolvedValue({
          name: 'someOtherFunction',
        } as TransactionDescription);
        const parser = contractParserMap.get('function');
        jest
          .mocked(parseBasicDisplayValues)
          .mockResolvedValue(displayValuesMock);
        await handler.handleAuthenticated(buildRpcCall(message));
        expect(blockaidService.parseTransaction).toHaveBeenCalledTimes(1);
        expect(parseWithERC20Abi).not.toHaveBeenCalled();
        expect(parser).not.toHaveBeenCalled();
        expect(parseBasicDisplayValues).toHaveBeenCalledTimes(1);
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              displayValues: displayValuesMock,
            }),
          }),
          'sign/transaction'
        );
      });
    });
  });

  describe('onActionApproved', () => {
    const mockAction: Action<Transaction> = {
      id: 'actionId',
      params: [],
      method: DAppProviderRequest.ETH_SEND_TX,
      site: {
        domain: 'example.com',
      },
      actionId: 'actiondId',
      status: ActionStatus.PENDING,
      time: 123123,
      scope: 'eip:43114',
      displayData: {
        chainId: '0xa86a', // 43114
        method: DAppProviderRequest.ETH_SEND_TX,
        txParams: {
          chainId: '0xa86a',
          to: '0x32131',
          from: '0x123123123',
          type: 2,
          gasLimit: '0x1',
          maxFeePerGas: '0x123',
          gas: 1,
        },
        displayValues: displayValuesMock,
        site: {
          domain: 'example.com',
        },
      },
    };

    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    it('returns error when network not found', async () => {
      jest
        .mocked(getTargetNetworkForTx)
        .mockRejectedValue(new Error('Network not found'));

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(getTargetNetworkForTx).toHaveBeenCalledTimes(1);
      expect(getTargetNetworkForTx).toHaveBeenCalledWith(
        mockAction.displayData.txParams,
        networkService,
        mockAction.scope
      );
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalledWith(new Error('Network not found'));
    });

    it('returns error when network fees are not available', async () => {
      jest
        .mocked(networkFeeService.getNetworkFee)
        .mockRejectedValue(new Error('Network fee error'));

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(networkFeeService.getNetworkFee).toHaveBeenCalledTimes(1);
      expect(networkFeeService.getNetworkFee).toHaveBeenCalledWith(networkMock);
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalledWith(new Error('Network fee error'));
    });

    it('returns error when converting to evm tx fails', async () => {
      jest.mocked(txToCustomEvmTx).mockImplementation(() => {
        throw new Error('Invalid tx params');
      });

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(txToCustomEvmTx).toHaveBeenCalledTimes(1);
      expect(txToCustomEvmTx).toHaveBeenCalledWith(
        mockAction.displayData.txParams,
        mockedFees
      );
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalledWith(new Error('Invalid tx params'));
    });

    it('returns error when signing fails', async () => {
      jest
        .mocked(walletService.sign)
        .mockRejectedValue(new Error('Wallet signing error'));

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock,
        111
      );

      expect(walletService.sign).toHaveBeenCalledTimes(1);
      expect(walletService.sign).toHaveBeenCalledWith(
        {
          chainId: 43114,
          data: '0x',
          gasLimit: 123,
          maxFeePerGas: '0x54',
          maxPriorityFeePerGas: 1n,
          nonce: 3,
          to: '0x123123',
          type: 2,
          value: '0x1',
        },
        networkMock,
        111
      );
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalledWith(
        new Error('Wallet signing error')
      );
    });

    it('returns error when sending the transction fails', async () => {
      jest
        .mocked(walletService.sign)
        .mockResolvedValue({ signedTx: '0x11111111' });
      jest
        .mocked(networkService.sendTransaction)
        .mockRejectedValue(new Error('Tx send error'));

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(networkService.sendTransaction).toHaveBeenCalledTimes(1);
      expect(networkService.sendTransaction).toHaveBeenCalledWith(
        { signedTx: '0x11111111' },
        networkMock
      );
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalledWith(new Error('Tx send error'));
    });

    it('creates notification on error', async () => {
      jest
        .mocked(getTargetNetworkForTx)
        .mockRejectedValue(new Error('Network not found'));

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(browser.notifications.create).toHaveBeenCalledTimes(1);
      expect(browser.notifications.create).toHaveBeenCalledWith({
        type: 'basic',
        iconUrl: '../../../../images/icon-32.png',
        title: 'Failed transaction',
        message: `Transaction failed! Network not found`,
        priority: 2,
      });
    });

    it('captures encrypted analytics event on error', async () => {
      jest
        .mocked(getTargetNetworkForTx)
        .mockRejectedValue(new Error('Network not found'));

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenCalledTimes(1);
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenCalledWith({
        name: 'transactionFailed',
        properties: {
          address: '0x123123123',
          chainId: '0xa86a',
          method: 'eth_sendTransaction',
          txHash: undefined,
        },
        windowId: '00000000-0000-0000-0000-000000000000',
      });
    });

    it('sends transaction', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(onSuccessMock).toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalledWith('0x0123');
      expect(onErrorMock).not.toHaveBeenCalled();
    });

    it('captures encrypted analytics event on success', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenCalledTimes(1);
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenCalledWith({
        name: 'transactionSuccessful',
        properties: {
          address: '0x123123123',
          chainId: '0xa86a',
          method: 'eth_sendTransaction',
          txHash: '0x0123',
        },
        windowId: '00000000-0000-0000-0000-000000000000',
      });
    });

    it('opens explorer link on pending notification click', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');
      jest
        .mocked(getExplorerAddressByNetwork)
        .mockReturnValue('https://explorer.example.com');

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(browser.notifications.create).toHaveBeenCalledTimes(1);
      expect(browser.notifications.create).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000',
        {
          type: 'basic',
          iconUrl: '../../../../images/icon-32.png',
          title: 'Pending transaction',
          message: `Transaction pending! View on the explorer.`,
          priority: 2,
        }
      );

      expect(browser.notifications.onClicked.addListener).toHaveBeenCalledTimes(
        1
      );

      expect(browser.tabs.create).not.toHaveBeenCalled();

      jest
        .mocked(browser.notifications.onClicked.addListener)
        .mock.calls[0]?.[0]?.('000');

      expect(browser.tabs.create).not.toHaveBeenCalled();

      jest
        .mocked(browser.notifications.onClicked.addListener)
        .mock.calls[0]?.[0]?.('00000000-0000-0000-0000-000000000000');

      expect(getExplorerAddressByNetwork).toHaveBeenCalledWith(
        networkMock,
        '0x0123'
      );

      expect(browser.tabs.create).toHaveBeenCalledTimes(1);
      expect(browser.tabs.create).toHaveBeenCalledWith({
        url: 'https://explorer.example.com',
      });
    });

    it('unsubcribes from clicks when pending browser notification closed', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');
      jest
        .mocked(getExplorerAddressByNetwork)
        .mockReturnValue('https://explorer.example.com');

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(browser.notifications.create).toHaveBeenCalledTimes(1);
      expect(browser.notifications.create).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000',
        {
          type: 'basic',
          iconUrl: '../../../../images/icon-32.png',
          title: 'Pending transaction',
          message: `Transaction pending! View on the explorer.`,
          priority: 2,
        }
      );

      expect(browser.notifications.onClosed.addListener).toHaveBeenCalledTimes(
        1
      );

      expect(
        browser.notifications.onClicked.removeListener
      ).not.toHaveBeenCalled();

      (
        jest.mocked(browser.notifications.onClosed.addListener).mock
          .calls[0]?.[0] as any
      )?.('000');

      expect(
        browser.notifications.onClicked.removeListener
      ).not.toHaveBeenCalled();

      (
        jest.mocked(browser.notifications.onClosed.addListener).mock
          .calls[0]?.[0] as any
      )?.('00000000-0000-0000-0000-000000000000');

      expect(
        browser.notifications.onClicked.removeListener
      ).toHaveBeenCalledWith(
        jest.mocked(browser.notifications.onClicked.addListener).mock
          .calls[0]?.[0]
      );
    });

    it('dismisses pending browser notification after 5 seconds', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');
      jest
        .mocked(getExplorerAddressByNetwork)
        .mockReturnValue('https://explorer.example.com');

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(browser.notifications.create).toHaveBeenCalledTimes(1);
      expect(browser.notifications.create).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000',
        {
          type: 'basic',
          iconUrl: '../../../../images/icon-32.png',
          title: 'Pending transaction',
          message: `Transaction pending! View on the explorer.`,
          priority: 2,
        }
      );

      expect(browser.notifications.onClosed.addListener).toHaveBeenCalledTimes(
        1
      );

      jest.advanceTimersByTime(4999);

      expect(
        browser.notifications.onClicked.removeListener
      ).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);

      expect(browser.notifications.clear).toHaveBeenCalledTimes(1);
      expect(browser.notifications.clear).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000'
      );
      expect(
        browser.notifications.onClicked.removeListener
      ).toHaveBeenCalledWith(
        jest.mocked(browser.notifications.onClicked.addListener).mock
          .calls[0]?.[0]
      );
    });

    it('creates transaction confirmed browser notification if wallet is unlocked', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');
      jest
        .mocked(getExplorerAddressByNetwork)
        .mockReturnValue('https://explorer.example.com');

      let resolveTransaction;
      jest.spyOn(provider, 'waitForTransaction').mockReturnValue(
        new Promise((resolve) => {
          resolveTransaction = resolve;
        })
      );

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(browser.notifications.clear).toHaveBeenCalledTimes(0);
      expect(browser.notifications.create).toHaveBeenCalledTimes(1);
      expect(browser.notifications.create).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000',
        expect.objectContaining({
          title: 'Pending transaction',
        })
      );

      resolveTransaction({ status: 1 });
      await Promise.resolve();
      await Promise.resolve();

      // clears prevous pending notification
      expect(browser.notifications.clear).toHaveBeenCalledTimes(1);
      expect(browser.notifications.clear).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000'
      );

      // creates new notification
      expect(browser.notifications.create).toHaveBeenCalledTimes(2);
      expect(browser.notifications.create).toHaveBeenNthCalledWith(
        2,
        '00000000-0000-0000-0000-000000000000',
        expect.objectContaining({
          title: 'Confirmed transaction',
        })
      );
    });

    it('does not create transaction confirmed browser notification when wallet gets locked while waiting', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');
      jest
        .mocked(getExplorerAddressByNetwork)
        .mockReturnValue('https://explorer.example.com');

      let resolveTransaction;
      jest.spyOn(provider, 'waitForTransaction').mockReturnValue(
        new Promise((resolve) => {
          resolveTransaction = resolve;
        })
      );

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(browser.notifications.clear).toHaveBeenCalledTimes(0);
      expect(browser.notifications.create).toHaveBeenCalledTimes(1);
      expect(browser.notifications.create).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000',
        expect.objectContaining({
          title: 'Pending transaction',
        })
      );

      (lockService as any).locked = true;

      resolveTransaction({ status: 1 });
      await Promise.resolve();
      await Promise.resolve();

      // clears prevous pending notification
      expect(browser.notifications.clear).toHaveBeenCalledTimes(1);
      expect(browser.notifications.clear).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000'
      );

      // creates new notification
      expect(browser.notifications.create).toHaveBeenCalledTimes(1);
    });

    it('measures time to confirmation and reports it', async () => {
      jest.mocked(networkService.sendTransaction).mockResolvedValue('0x0123');
      jest
        .mocked(getExplorerAddressByNetwork)
        .mockReturnValue('https://explorer.example.com');
      const durationMock = measureDuration();
      jest.mocked(durationMock.end).mockReturnValue(1000);

      let resolveTransaction;
      jest.spyOn(provider, 'waitForTransaction').mockReturnValue(
        new Promise((resolve) => {
          resolveTransaction = resolve;
        })
      );

      await handler.onActionApproved(
        mockAction,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(durationMock.start).toHaveBeenCalledTimes(1);

      resolveTransaction({ status: 1 });
      await jest.runAllTimersAsync();

      expect(durationMock.end).toHaveBeenCalledTimes(1);

      // creates new notification
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenCalledTimes(2);
      expect(
        analyticsServicePosthog.captureEncryptedEvent
      ).toHaveBeenNthCalledWith(2, {
        name: 'TransactionTimeToConfirmation',
        properties: {
          chainId: '0xa86a',
          duration: 1000,
          rpcUrl: '',
          site: 'example.com',
          success: true,
          txType: 'eth_sendTransaction',
        },
        windowId: '00000000-0000-0000-0000-000000000000',
      });
    });
  });
});
