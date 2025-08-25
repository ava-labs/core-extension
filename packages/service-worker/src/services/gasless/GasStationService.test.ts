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
    setAppCheckToken: jest.fn(),
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
    service.sendMessage('message', 'request' as ExtensionRequest);
    await new Promise(process.nextTick);

    expect(appCheckMock.getAppcheckToken).toHaveBeenCalled();
    expect(messageData).toEqual({
      message: 'message',
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
        data: '',
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
            data: '',
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
            data: '',
            challengeHex: 'challengeHex',
            solutionHex: 'solutionHex',
            fromAddress: 'fromAddress',
          }),
      ).rejects.toThrow('No network');
    });

    it('should call the `setDefaultStateValues` because of the  error', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest
        .fn()
        .mockResolvedValueOnce({ error: { category: 'do_not_retry' } });
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
      await service.fundTx({
        data: '',
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });
      expect(service.setDefaultStateValues).toHaveBeenCalledWith({
        fundTxDoNotRetryError: true,
      });
    });

    it('should call once again the `fetchAndSolveChallange` because of the `RETRY_WITH_NEW_CHALLENGE` error', async () => {
      const gaslessService = new GaslessSdk('asd');
      gaslessService.fundTx = jest.fn().mockResolvedValueOnce({
        error: { category: 'RETRY_WITH_NEW_CHALLENGE' },
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
      service.fetchAndSolveChallange = jest.fn();
      await service.fundTx({
        data: '',
        challengeHex: 'challengeHex',
        solutionHex: 'solutionHex',
        fromAddress: 'fromAddress',
      });
      expect(service.fetchAndSolveChallange).toHaveBeenCalledTimes(1);
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
            data: '',
            challengeHex: 'challengeHex',
            solutionHex: 'solutionHex',
            fromAddress: 'fromAddress',
          }),
      ).rejects.toThrow('No tx hash');
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
        data: '',
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
  });
});
