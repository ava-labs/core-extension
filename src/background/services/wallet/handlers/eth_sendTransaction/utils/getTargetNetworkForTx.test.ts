import { jest } from '@jest/globals';
import { ChainId, NetworkVMType } from '@avalabs/chains-sdk';
import getTargetNetworkForTx from './getTargetNetworkForTx';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { StorageService } from '@src/background/services/storage/StorageService';
import { errorCodes, EthereumRpcError } from 'eth-rpc-errors';
import { FeatureFlagService } from '@src/background/services/featureFlags/FeatureFlagService';
import { caipToChainId } from '@src/utils/caipConversion';

jest.mock('@src/background/services/network/NetworkService');

const uiActiveNetwork = {
  chainId: 43114,
  isTestnet: false,
};

const eth = {
  isTestnet: false,
  vmName: NetworkVMType.EVM,
  chainId: 0x1,
};

const networkFromRequestScope = {
  isTestnet: true,
  vmName: NetworkVMType.EVM,
  chainId: 43113,
};

const btc = {
  ...eth,
  chainId: ChainId.BITCOIN_TESTNET,
  vmName: NetworkVMType.BITCOIN,
};

const otherNetwork = {
  ...eth,
  isTestnet: true,
  chainId: 0x2,
};

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
      {} as unknown as FeatureFlagService
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
    };

    const network = await getTargetNetworkForTx(
      { chainId: 2 } as any,
      mockNetworkService
    );

    expect(network).toBe(otherNetwork);
  });

  it('throws error if an unsupported chainId was provided', async () => {
    await expect(
      getTargetNetworkForTx({ chainId: 12321 } as any, mockNetworkService)
    ).rejects.toThrow(getRpcError('Provided ChainID is not supported', 1));
  });

  it('throws error for non EVM networks', async () => {
    await expect(
      getTargetNetworkForTx(
        { chainId: ChainId.BITCOIN_TESTNET } as any,
        mockNetworkService
      )
    ).rejects.toThrow(getRpcError('Provided ChainID is not supported', 1));
  });

  it('throws error for cross-environment transactions', async () => {
    await expect(
      getTargetNetworkForTx({ chainId: 43113 } as any, mockNetworkService)
    ).rejects.toThrow(
      getRpcError('Provided ChainID is in a different environment', 1)
    );
  });

  it('throws error for custom networks', async () => {
    // eslint-disable-next-line
    // @ts-ignore
    mockNetworkService.uiActiveNetwork = {
      chainId: 1234,
      isTestnet: true,
    };
    mockNetworkService.customNetworks[otherNetwork.chainId] =
      otherNetwork as any;

    await expect(
      getTargetNetworkForTx(
        { chainId: otherNetwork.chainId } as any,
        mockNetworkService
      )
    ).rejects.toThrow(
      getRpcError('ChainID is not supported for custom networks', 1)
    );
  });
});
