import { jest } from '@jest/globals';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { Transaction } from '../models';
import getTargetNetworkForTx from './getTargetNetworkForTx';
import { NetworkService } from '../../network/NetworkService';
import { StorageService } from '../../storage/StorageService';
import { errorCodes, EthereumRpcError } from 'eth-rpc-errors';
import { FeatureFlagService } from '../../featureFlags/FeatureFlagService';
import { AnalyticsService } from '../../analytics/AnalyticsService';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { LockService } from '../../lock/LockService';

jest.mock('../../network/NetworkService');
jest.mock('../../featureFlags/FeatureFlagService');

const transactionMock = {
  chainId: '0x1',
} as unknown as Transaction;

const networkMock = {
  isTestnet: true,
  vmName: NetworkVMType.EVM,
  chainId: 0x1,
} as unknown as Network;

const getRpcError = (message: string, chainId: number) =>
  new EthereumRpcError(errorCodes.rpc.invalidParams, message, {
    chainId,
  });

describe('background/services/transactions/utils/getTargetNetworkForTx.ts', () => {
  let mockNetworkService: NetworkService;
  let mockFeatureFlagService: FeatureFlagService;

  beforeEach(() => {
    jest.resetAllMocks();

    mockNetworkService = new NetworkService({} as unknown as StorageService);
    mockNetworkService['activeNetwork'] = networkMock;
    mockNetworkService.isActiveNetwork = jest.fn();

    // We need the @ts-ignore, since customNetworks is defined as a read-only accessor.
    // Normally we'd be able to use Jest API to mock it, but the latest version (29.3 at
    // the moment of writing this comment) is bugged and does not allow mocking getters
    // and setters on mocked classes.
    //
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockNetworkService['customNetworks'] = {};

    mockFeatureFlagService = new FeatureFlagService(
      {} as unknown as AnalyticsService,
      {} as unknown as LockService
    );
    mockFeatureFlagService['featureFlags'] = {
      [FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]: true,
    } as Record<FeatureGates, boolean>;
  });

  it('returns the active network if chainId was not provided', async () => {
    const network = await getTargetNetworkForTx(
      {} as unknown as Transaction,
      mockNetworkService,
      mockFeatureFlagService
    );

    expect(network).toBe(networkMock);
  });

  it(`returns the active network if feature flag is disabled and the provided chainId equals the active network's`, async () => {
    mockFeatureFlagService.featureFlags[
      FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT
    ] = false;

    jest.spyOn(mockNetworkService, 'isActiveNetwork').mockReturnValueOnce(true);

    const network = await getTargetNetworkForTx(
      transactionMock,
      mockNetworkService,
      mockFeatureFlagService
    );

    expect(network).toBe(networkMock);
  });

  it(`throws an error if feature flag is disabled and the provided chainId differs from the active network's`, async () => {
    mockFeatureFlagService.featureFlags[
      FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT
    ] = false;

    jest
      .spyOn(mockNetworkService, 'isActiveNetwork')
      .mockReturnValueOnce(false);

    await expect(
      getTargetNetworkForTx(
        transactionMock,
        mockNetworkService,
        mockFeatureFlagService
      )
    ).rejects.toThrow(getRpcError('Custom ChainID is not supported', 1));
  });

  it('returns the proper network if a supported chanId was provided', async () => {
    const otherNetwork = {
      ...networkMock,
      chainId: 0x2,
    };

    jest
      .spyOn(mockNetworkService, 'getNetwork')
      .mockResolvedValueOnce(otherNetwork);

    const network = await getTargetNetworkForTx(
      transactionMock,
      mockNetworkService,
      mockFeatureFlagService
    );

    expect(network).toBe(otherNetwork);
  });

  it('throws error if an unsupported chainId was provided', async () => {
    jest
      .spyOn(mockNetworkService, 'getNetwork')
      .mockResolvedValueOnce(undefined);

    await expect(
      getTargetNetworkForTx(
        transactionMock,
        mockNetworkService,
        mockFeatureFlagService
      )
    ).rejects.toThrow(getRpcError('Provided ChainID is not supported', 1));
  });

  it('throws error for non EVM networks', async () => {
    jest.spyOn(mockNetworkService, 'getNetwork').mockResolvedValueOnce({
      ...networkMock,
      vmName: NetworkVMType.BITCOIN,
    });

    await expect(
      getTargetNetworkForTx(
        transactionMock,
        mockNetworkService,
        mockFeatureFlagService
      )
    ).rejects.toThrow(getRpcError('Provided ChainID is not supported', 1));
  });

  it('throws error for cross-environment transactions', async () => {
    jest.spyOn(mockNetworkService, 'getNetwork').mockResolvedValueOnce({
      ...networkMock,
      isTestnet: false,
    });

    await expect(
      getTargetNetworkForTx(
        transactionMock,
        mockNetworkService,
        mockFeatureFlagService
      )
    ).rejects.toThrow(
      getRpcError('Provided ChainID is in a different environment', 1)
    );
  });

  it('throws error for custom networks', async () => {
    mockNetworkService.customNetworks[networkMock.chainId] = networkMock;

    jest
      .spyOn(mockNetworkService, 'getNetwork')
      .mockResolvedValueOnce(networkMock);

    await expect(
      getTargetNetworkForTx(
        transactionMock,
        mockNetworkService,
        mockFeatureFlagService
      )
    ).rejects.toThrow(
      getRpcError('ChainID is not supported for custom networks', 1)
    );
  });
});
