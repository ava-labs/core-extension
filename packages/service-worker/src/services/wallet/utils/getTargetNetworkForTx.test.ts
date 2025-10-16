import { jest } from '@jest/globals';
import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import getTargetNetworkForTx from './getTargetNetworkForTx';
import { NetworkService } from '../../../services/network/NetworkService';
import { StorageService } from '../../../services/storage/StorageService';
import { errorCodes, EthereumRpcError } from 'eth-rpc-errors';
import { FeatureFlagService } from '../../../services/featureFlags/FeatureFlagService';
import { caipToChainId, decorateWithCaipId } from '@core/common';
import { GlacierService } from '~/services/glacier/GlacierService';

jest.mock('../../../services/network/NetworkService');

const uiActiveNetwork = decorateWithCaipId({
  chainId: 43114,
  vmName: NetworkVMType.EVM,
  isTestnet: false,
} as any);

const eth = decorateWithCaipId({
  isTestnet: false,
  vmName: NetworkVMType.EVM,
  chainId: 0x1,
} as any);

const networkFromRequestScope = decorateWithCaipId({
  isTestnet: true,
  vmName: NetworkVMType.EVM,
  chainId: 43113,
} as any);

const btc = decorateWithCaipId({
  ...eth,
  chainId: ChainId.BITCOIN_TESTNET,
  vmName: NetworkVMType.BITCOIN,
} as any);

const otherNetwork = decorateWithCaipId({
  ...eth,
  isTestnet: true,
  chainId: 0x2,
} as any);

const getRpcError = (message: string, chainId: number) =>
  new EthereumRpcError(errorCodes.rpc.invalidParams, message, {
    chainId,
  });

const normalizeId = (networkId: string | number) => {
  if (typeof networkId === 'string') {
    return caipToChainId(networkId);
  }

  return networkId;
};

describe('background/services/transactions/utils/getTargetNetworkForTx.ts', () => {
  let mockNetworkService: NetworkService;

  beforeEach(() => {
    jest.resetAllMocks();

    mockNetworkService = new NetworkService(
      {} as unknown as StorageService,
      {} as unknown as FeatureFlagService,
      {} as unknown as GlacierService,
    );

    // eslint-disable-next-line
    // @ts-ignore
    mockNetworkService.allNetworks = {
      promisify: async () => [
        uiActiveNetwork,
        eth,
        networkFromRequestScope,
        btc,
        otherNetwork,
      ],
    } as any;

    // eslint-disable-next-line
    // @ts-ignore
    mockNetworkService.uiActiveNetwork = uiActiveNetwork;

    jest
      .mocked(mockNetworkService.getNetwork)
      .mockImplementation(async (scopeOrId: string | number) => {
        const id = normalizeId(scopeOrId);

        return [
          networkFromRequestScope,
          eth,
          uiActiveNetwork,
          otherNetwork,
          btc,
        ].find(({ chainId }) => chainId === id) as any;
      });

    // We need the @ts-ignore, since customNetworks is defined as a read-only accessor.
    // Normally we'd be able to use Jest API to mock it, but the latest version (29.3 at
    // the moment of writing this comment) is bugged and does not allow mocking getters
    // and setters on mocked classes.
    //
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockNetworkService['customNetworks'] = {};
  });

  it('returns the proper network if a supported chainId was provided', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    mockNetworkService.uiActiveNetwork = {
      chainId: 1234,
      isTestnet: true,
      caipId: 'eip155:1234',
    };

    const network = await getTargetNetworkForTx(
      { chainId: 2 } as any,
      mockNetworkService,
      eth.caipId,
    );

    expect(network).toBe(otherNetwork);
  });

  it('throws error if an unsupported chainId was provided', async () => {
    await expect(
      getTargetNetworkForTx(
        { chainId: 12321 } as any,
        mockNetworkService,
        'eip155:1',
      ),
    ).rejects.toThrow(getRpcError('Provided ChainID is not supported', 1));
  });

  it('throws error for non EVM networks', async () => {
    await expect(
      getTargetNetworkForTx(
        { chainId: ChainId.BITCOIN_TESTNET } as any,
        mockNetworkService,
        eth.caipId,
      ),
    ).rejects.toThrow(getRpcError('Provided ChainID is not supported', 1));
  });

  it('throws error for cross-environment transactions', async () => {
    await expect(
      getTargetNetworkForTx(
        { chainId: 43113 } as any,
        mockNetworkService,
        eth.caipId,
      ),
    ).rejects.toThrow(
      getRpcError('Provided ChainID is in a different environment', 1),
    );
  });

  it('allows chainIds of custom networks as long as it is also the active network for dApp', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    mockNetworkService.uiActiveNetwork = {
      chainId: 1234,
      isTestnet: true,
      caipId: 'eip155:1234',
    };
    mockNetworkService.customNetworks[otherNetwork.chainId] =
      otherNetwork as any;

    expect(
      await getTargetNetworkForTx(
        { chainId: otherNetwork.chainId } as any,
        mockNetworkService,
        otherNetwork.caipId,
      ),
    ).toEqual(otherNetwork);
  });
});
