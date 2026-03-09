import { GaslessSdk } from '@avalabs/core-gasless-sdk';
import { ExtensionRequest, GaslessEvents } from '@core/types';
import { getProviderForNetwork } from '@core/common';
import { Transaction, TransactionLike } from 'ethers';
import { AppCheckService } from '../appcheck/AppCheckService';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { GasStationService } from './GasStationService';

jest.mock('@avalabs/core-gasless-sdk', () => {
  const functions = {
    isEligibleForChain: jest.fn().mockResolvedValue(true),
    setHeaders: jest.fn(),
    fundTx: jest.fn(),
  };

  return { GaslessSdk: jest.fn().mockImplementation(() => functions) };
});

jest.mock('../appcheck/AppCheckService');
jest.mock('ethers');
jest.mock('@core/common');
describe('src/background/services/gasless/GasStationService', () => {
  const appCheckMock = jest.mocked<AppCheckService>({
    getAppcheckToken: jest.fn().mockResolvedValue({ token: 'appCheckToken' }),
  } as any);

  const networkService = new NetworkService({} as any, {} as any, {} as any);
  const networkFeeService = new NetworkFeeService({} as any);

  const gasStationUrl = 'https://core-gas-station.avax-test.network';
  const realEnv = process.env;

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env = {
      ...realEnv,
      GASLESS_SERVICE_URL: gasStationUrl,
    };
  });

  it('should throw and error when the `GASLESS_SERVICE_URL` is missing', () => {
    delete process.env.GASLESS_SERVICE_URL;

    expect(
      () =>
        new GasStationService(appCheckMock, networkService, networkFeeService),
    ).toThrow('GASLESS_SERVICE_URL is missing');
  });

  it('should call the `SDK` with the right `URL`', () => {
    new GasStationService(appCheckMock, networkService, networkFeeService);

    expect(GaslessSdk).toHaveBeenCalledWith(gasStationUrl);
  });

  it('should set the default state values and update the state with a new value', () => {
    const service = new GasStationService(
      appCheckMock,
      networkService,
      networkFeeService,
    );
    service.updateState = jest.fn();
    service.setDefaultStateValues({
      fundTxHex: 'fundTxHex',
    });
    expect(service.updateState).toHaveBeenCalledWith({
      challengeHex: '',
      fundTxDoNotRetryError: false,
      fundTxHex: 'fundTxHex',
      isFundInProgress: false,
      solutionHex: '',
    });
  });

  it('should send a message with the right data and reqest an appcheck token from the service', async () => {
    const service = new GasStationService(
      appCheckMock,
      networkService,
      networkFeeService,
    );
    let messageData;
    service.addListener(GaslessEvents.SEND_OFFSCREEN_MESSAGE, (message) => {
      messageData = message;
    });
    const message = { key: 'value' };
    service.sendMessage(message, 'request' as ExtensionRequest);
    await new Promise(process.nextTick);

    expect(appCheckMock.getAppcheckToken).toHaveBeenCalled();
    expect(messageData).toEqual({
      message,
      request: 'request',
      token: 'appCheckToken',
    });
  });

  it('should call the sdk `isEligibleForChain` with the right `chainId`', async () => {
    const gaslessService = new GaslessSdk('asd');
    const service = new GasStationService(
      appCheckMock,
      networkService,
      networkFeeService,
    );

    await service.getEligibility({ chainId: 'chainId' });

    expect(gaslessService.isEligibleForChain).toHaveBeenCalledWith({
      chainId: 'chainId',
    });
  });

  it('should dispatch the modified state object', () => {
    const service = new GasStationService(
      appCheckMock,
      networkService,
      networkFeeService,
    );
    const state = {
      fundTxDoNotRetryError: true,
      solutionHex: '',
      fundTxHex: '',
      isFundInProgress: false,
      challengeHex: '',
    };
    jest.spyOn(service.gaslessState, 'dispatch');
    service.updateState(state);
    expect(service.gaslessState.dispatch).toHaveBeenCalledWith(state);
  });

  it('should put the new hex values to the state and merge them with the default state values and after dispatch', () => {
    const service = new GasStationService(
      appCheckMock,
      networkService,
      networkFeeService,
    );
    jest.spyOn(service.gaslessState, 'dispatch');
    service.setHexValuesAndFund({
      challengeHex: 'challengeHex',
      solutionHex: 'solutionHex',
    });
    expect(service.gaslessState.dispatch).toHaveBeenCalledWith({
      fundTxDoNotRetryError: false,
      solutionHex: 'solutionHex',
      fundTxHex: '',
      isFundInProgress: false,
      challengeHex: 'challengeHex',
    });
  });

  it('should send a message with the `pipelineIndex` and the right method `ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE`', () => {
    const service = new GasStationService(
      appCheckMock,
      networkService,
      networkFeeService,
    );
    service.sendMessage = jest.fn();
    service.fetchAndSolveChallange(0);
    expect(service.sendMessage).toHaveBeenCalledWith(
      { pipelineIndex: 0 },
      ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE,
    );
  });

  describe('fundTx()', () => {
    it('should merge the default state with the new state values', () => {
      const service = new GasStationService(
        appCheckMock,
        networkService,
        networkFeeService,
      );
      jest.spyOn(service.gaslessState, 'dispatch');
      service.fundTx({
        data: { chainId: 1 },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });
      expect(service.gaslessState.dispatch).toHaveBeenCalledWith({
        fundTxDoNotRetryError: false,
        solutionHex: 'solutionHex',
        fundTxHex: '',
        isFundInProgress: true,
        challengeHex: 'challengeHex',
      });
    });

    it('should throw an error because cannot get an appcheck token', () => {
      const appCheckMock2 = jest.mocked<AppCheckService>({} as any);
      appCheckMock2.getAppcheckToken = jest.fn().mockResolvedValueOnce('');
      const service = new GasStationService(
        appCheckMock2,
        networkService,
        networkFeeService,
      );
      expect(
        async () =>
          await service.fundTx({
            data: { chainId: 1 },
            challengeHex: 'challengeHex',
            solutionHex: 'solutionHex',
            fromAddress: 'fromAddress',
          }),
      ).rejects.toThrow('Cannot get Appcheck Token');
    });

    it('should throw an error because it cannot get the network', () => {
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest
        .fn()
        .mockResolvedValueOnce(undefined);
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeService,
      );
      expect(
        async () =>
          await service.fundTx({
            data: { chainId: 1 },
            challengeHex: 'challengeHex',
            solutionHex: 'solutionHex',
            fromAddress: 'fromAddress',
          }),
      ).rejects.toThrow('No network');
    });

    it('should throw for non-unauthorized errors', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValueOnce({
        error: { category: 'do_not_retry', message: 'SOME_ERROR' },
      });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });

      await expect(
        service.fundTx({
          data: { chainId: 1 },
          challengeHex: 'challengeHex',
          solutionHex: 'solutionHex',
          fromAddress: 'fromAddress',
        }),
      ).rejects.toThrow('Gasless funding failed: SOME_ERROR');
    });

    it('should throw for non-unauthorized errors using category when message is missing', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValueOnce({
        error: { category: 'do_not_retry' },
      });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });

      await expect(
        service.fundTx({
          data: { chainId: 1 },
          challengeHex: 'challengeHex',
          solutionHex: 'solutionHex',
          fromAddress: 'fromAddress',
        }),
      ).rejects.toThrow('Gasless funding failed: do_not_retry');
    });

    it('should throw when waitForTransaction returns null', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest
        .fn()
        .mockResolvedValueOnce({ txHash: 'txHash' });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });
      jest.mocked(getProviderForNetwork).mockReturnValue({
        async waitForTransaction() {
          return null;
        },
      } as any);

      await expect(
        service.fundTx({
          data: { chainId: 1 },
          challengeHex: 'challengeHex',
          solutionHex: 'solutionHex',
          fromAddress: 'fromAddress',
        }),
      ).rejects.toThrow('Gasless funding transaction not confirmed');
    });

    it('should call once again the `fetchAndSolveChallange` because of the `RETRY_WITH_NEW_CHALLENGE` error and resolve with retry result', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest
        .fn()
        .mockResolvedValueOnce({
          error: { category: 'RETRY_WITH_NEW_CHALLENGE' },
        })
        .mockResolvedValueOnce({ txHash: 'retryTxHash' });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValue('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValue({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementation((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });
      jest.mocked(getProviderForNetwork).mockReturnValue({
        async waitForTransaction() {
          return { hash: 'retryFundTxHex' };
        },
      } as any);

      service.sendMessage = jest.fn();
      service.setDefaultStateValues = jest.fn();

      const fundPromise = service.fundTx({
        data: { chainId: 1 },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });

      await new Promise(process.nextTick);

      expect(service.sendMessage).toHaveBeenCalledTimes(1);

      await service.setHexValuesAndFund({
        challengeHex: 'newChallengeHex',
        solutionHex: 'newSolutionHex',
        pipelineIndex: 0,
      });

      const result = await fundPromise;
      expect(result).toBe('retryFundTxHex');
    });

    it('should throw an error because of the missing `txHash`', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValueOnce({});
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });
      service.fetchAndSolveChallange = jest.fn();

      expect(
        async () =>
          await service.fundTx({
            data: { chainId: 1 },
            challengeHex: 'challengeHex',
            solutionHex: 'solutionHex',
            fromAddress: 'fromAddress',
          }),
      ).rejects.toThrow('No tx hash');
    });

    it('should throw "Gasless funding unauthorized" for UNAUTHORIZED errors', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValueOnce({
        error: { category: 'some_category', message: 'UNAUTHORIZED' },
      });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });

      await expect(
        service.fundTx({
          data: { chainId: 1 },
          challengeHex: 'challengeHex',
          solutionHex: 'solutionHex',
          fromAddress: 'fromAddress',
        }),
      ).rejects.toThrow('Gasless funding unauthorized');
    });

    it('should not retry when attempt count is already >= 2', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValue({
        error: { category: 'RETRY_WITH_NEW_CHALLENGE' },
      });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValue('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValue({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementation((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });

      service.sendMessage = jest.fn();

      // First call triggers retry
      void service.fundTx({
        data: { chainId: 1 },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });

      await new Promise(process.nextTick);
      expect(service.sendMessage).toHaveBeenCalledTimes(1);

      // Second call (attempt >= 2) should throw instead of retrying
      await expect(
        service.fundTx({
          data: { chainId: 1 },
          challengeHex: 'challengeHex2',
          solutionHex: 'solutionHex2',
          fromAddress: 'fromAddress',
        }),
      ).rejects.toThrow('Gasless funding failed: RETRY_WITH_NEW_CHALLENGE');
    });

    it('should return the funded tx hash on successful funding', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest
        .fn()
        .mockResolvedValueOnce({ txHash: 'txHash' });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });
      jest.mocked(getProviderForNetwork).mockReturnValue({
        async waitForTransaction() {
          return { hash: 'confirmedTxHash' };
        },
      } as any);

      const result = await service.fundTx({
        data: { chainId: 1 },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });

      expect(result).toBe('confirmedTxHash');
    });

    it('should set fundTxDoNotRetryError on non-retry errors', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValueOnce({
        error: { category: 'do_not_retry', message: 'SOME_ERROR' },
      });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });
      service.setDefaultStateValues = jest.fn();

      await expect(
        service.fundTx({
          data: { chainId: 1 },
          challengeHex: 'challengeHex',
          solutionHex: 'solutionHex',
          fromAddress: 'fromAddress',
        }),
      ).rejects.toThrow();

      expect(service.setDefaultStateValues).toHaveBeenCalledWith({
        fundTxDoNotRetryError: true,
      });
    });

    it('should set the rigth states in the flow', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest
        .fn()
        .mockResolvedValueOnce({ txHash: 'txHash' });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });
      jest.mocked(getProviderForNetwork).mockReturnValue({
        async waitForTransaction() {
          return { hash: 'fundTxHex' };
        },
      } as any);
      service.setDefaultStateValues = jest.fn();
      await service.fundTx({
        data: { chainId: 1 },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });
      expect(service.setDefaultStateValues).toHaveBeenNthCalledWith(1, {
        challengeHex: 'challengeHex',
        isFundInProgress: true,
        solutionHex: 'solutionHex',
      });
      expect(service.setDefaultStateValues).toHaveBeenNthCalledWith(2, {
        challengeHex: 'challengeHex',
        fundTxHex: 'fundTxHex',
        solutionHex: 'solutionHex',
      });
    });

    it('should use data.maxFeePerGas when networkFee is not available', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest
        .fn()
        .mockResolvedValueOnce({ txHash: 'txHash' });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValueOnce('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValueOnce(null);
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementationOnce((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });
      jest.mocked(getProviderForNetwork).mockReturnValue({
        async waitForTransaction() {
          return { hash: 'fundTxHex' };
        },
      } as any);

      const result = await service.fundTx({
        data: { chainId: 1, maxFeePerGas: 5000000n },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });

      expect(Transaction.from).toHaveBeenCalledWith(
        expect.objectContaining({ maxFeePerGas: 5000000n }),
      );
      expect(result).toBe('fundTxHex');
    });
  });

  describe('setHexValuesAndFund()', () => {
    it('should reject the retry promise when pipeline data is missing', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValueOnce({
        error: { category: 'RETRY_WITH_NEW_CHALLENGE' },
      });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValue('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValue({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementation((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });

      service.sendMessage = jest.fn();

      const fundPromise = service.fundTx({
        data: { chainId: 1 },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });

      await new Promise(process.nextTick);

      await service.setHexValuesAndFund({
        challengeHex: 'newChallengeHex',
        solutionHex: 'newSolutionHex',
        pipelineIndex: 999,
      });

      await expect(fundPromise).rejects.toThrow('No data for funding.');
    });

    it('should reject the retry promise when the retry fundTx throws', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest
        .fn()
        .mockResolvedValueOnce({
          error: { category: 'RETRY_WITH_NEW_CHALLENGE' },
        })
        .mockResolvedValueOnce({
          error: { category: 'do_not_retry', message: 'RETRY_ALSO_FAILED' },
        });
      const networkServiceMock = jest.mocked<NetworkService>({} as any);
      networkServiceMock.getNetwork = jest.fn().mockResolvedValue('1');
      const networkFeeServiceMock = jest.mocked<NetworkFeeService>({} as any);

      networkFeeServiceMock.getNetworkFee = jest
        .fn()
        .mockResolvedValue({ medium: { maxFeePerGas: 1000000n } });
      const service = new GasStationService(
        appCheckMock,
        networkServiceMock,
        networkFeeServiceMock,
      );
      jest
        .mocked(Transaction.from)
        .mockImplementation((_?: string | TransactionLike<string>) => {
          return {
            unsignedSerialized: 'unsignedSerializedTxHex',
          } as Transaction;
        });

      service.sendMessage = jest.fn();

      const fundPromise = service.fundTx({
        data: { chainId: 1 },
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });

      await new Promise(process.nextTick);

      await service.setHexValuesAndFund({
        challengeHex: 'newChallengeHex',
        solutionHex: 'newSolutionHex',
        pipelineIndex: 0,
      });

      await expect(fundPromise).rejects.toThrow(
        'Gasless funding failed: RETRY_ALSO_FAILED',
      );
    });

    it('should not call fundTx when pipelineIndex is undefined', async () => {
      const service = new GasStationService(
        appCheckMock,
        networkService,
        networkFeeService,
      );
      jest.spyOn(service.gaslessState, 'dispatch');

      await service.setHexValuesAndFund({
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
      });

      expect(service.gaslessState.dispatch).toHaveBeenCalledWith({
        fundTxDoNotRetryError: false,
        solutionHex: 'solutionHex',
        fundTxHex: '',
        isFundInProgress: false,
        challengeHex: 'challengeHex',
      });
    });
  });

  describe('getEligibility()', () => {
    it('should throw when appcheck token is missing', async () => {
      const appCheckMock2 = jest.mocked<AppCheckService>({} as any);
      appCheckMock2.getAppcheckToken = jest.fn().mockResolvedValueOnce('');
      const service = new GasStationService(
        appCheckMock2,
        networkService,
        networkFeeService,
      );

      await expect(
        service.getEligibility({ chainId: 'chainId' }),
      ).rejects.toThrow('Cannot get the Appcheck Token');
    });

    it('should pass fromAddress and nonce to sdk', async () => {
      const gaslessService = new GaslessSdk('asd');
      const service = new GasStationService(
        appCheckMock,
        networkService,
        networkFeeService,
      );

      await service.getEligibility({
        chainId: '43114',
        fromAddress: '0xabc',
        nonce: 5,
      });

      expect(gaslessService.isEligibleForChain).toHaveBeenCalledWith({
        chainId: '43114',
        from: '0xabc',
        nonce: 5,
      });
    });

    it('should set X-Firebase-AppCheck header before calling sdk', async () => {
      const gaslessService = new GaslessSdk('asd');
      const service = new GasStationService(
        appCheckMock,
        networkService,
        networkFeeService,
      );

      await service.getEligibility({ chainId: 'chainId' });

      expect(gaslessService.setHeaders).toHaveBeenCalledWith({
        'X-Firebase-AppCheck': 'appCheckToken',
      });
    });
  });
});
