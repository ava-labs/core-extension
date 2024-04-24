import {
  BlockchainId,
  Glacier,
  Network,
  PrimaryNetwork,
  PrimaryNetworkChainName,
} from '@avalabs/glacier-sdk';
import { GlacierService } from './GlacierService';

import { wait } from '@avalabs/utils-sdk';

jest.mock('@avalabs/glacier-sdk');
jest.mock('@avalabs/utils-sdk', () => ({
  ...jest.requireActual('@avalabs/utils-sdk'),
  wait: jest.fn(),
}));

const healthCheckMock = jest.fn();
const supportedChainsMock = jest.fn();
const reindexNft = jest.fn();
const getTokenDetails = jest.fn();
const getBalancesByAddresses = jest.fn();

const pchainBalance = {
  balances: {
    unlockedUnstaked: [],
    unlockedStaked: [],
    lockedPlatform: [],
    lockedStakeable: [],
    lockedStaked: [],
    pendingStaked: [],
    atomicMemoryUnlocked: [],
    atomicMemoryLocked: [],
  },
  chainInfo: {
    chainName: PrimaryNetworkChainName.P_CHAIN,
    network: PrimaryNetwork.FUJI,
  },
};

const waitForFirstHealthCheck = async () => {
  jest.runOnlyPendingTimers();
  await new Promise(jest.requireActual('timers').setImmediate);
};

describe('src/background/services/glacier/GlacierService.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();

    (Glacier as jest.Mock).mockReturnValue({
      healthCheck: {
        healthCheck: healthCheckMock.mockResolvedValue({
          status: 'ok',
        }),
      },
      evmChains: {
        supportedChains: supportedChainsMock,
      },
      nfTs: {
        reindexNft,
        getTokenDetails,
      },
      primaryNetworkBalances: {
        getBalancesByAddresses:
          getBalancesByAddresses.mockResolvedValue(pchainBalance),
      },
    });
    jest.mocked(wait).mockResolvedValue();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('checks if glacier is helthy every 5 seconds', async () => {
    new GlacierService();

    for (let i = 0; i < 3; i++) {
      jest.advanceTimersByTime(5000);
      expect(healthCheckMock).toHaveBeenCalledTimes(i + 1);
    }
  });

  describe('reindexNft', () => {
    it('schedules reindexing of the given NFT', async () => {
      getTokenDetails.mockResolvedValue({
        metadata: {
          metadataLastUpdatedTimestamp: Infinity,
        },
      });

      const glacierService = new GlacierService();
      await glacierService.refreshNftMetadata('address', 'chainId', 'tokenId');

      expect(reindexNft).toHaveBeenCalledWith({
        address: 'address',
        chainId: 'chainId',
        tokenId: 'tokenId',
      });
    });

    it('waits 2 seconds before first fetch', async () => {
      const mockedTimestamp = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(mockedTimestamp * 1000);

      getTokenDetails.mockResolvedValue({
        metadata: {
          metadataLastUpdatedTimestamp: mockedTimestamp + 1000000,
        },
      });

      const glacierService = new GlacierService();

      glacierService.refreshNftMetadata('address', 'chainId', 'tokenId');

      expect(getTokenDetails).not.toHaveBeenCalled();

      jest.advanceTimersByTime(2500);
      jest.runOnlyPendingTimers();
      await new Promise(jest.requireActual('timers').setImmediate);

      expect(getTokenDetails).toHaveBeenCalledTimes(1);
    });

    it('polls NFT details until watching for updates', async () => {
      const mockedTimestamp = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(mockedTimestamp * 1000);

      getTokenDetails
        .mockResolvedValueOnce({
          metadata: {
            metadataLastUpdatedTimestamp: undefined,
          },
        })
        .mockResolvedValueOnce({
          metadata: {
            metadataLastUpdatedTimestamp: undefined,
          },
        })
        .mockResolvedValue({
          metadata: {
            metadataLastUpdatedTimestamp: mockedTimestamp + 1000000,
          },
        });

      const glacierService = new GlacierService();

      await glacierService.refreshNftMetadata('address', 'chainId', 'tokenId');

      expect(getTokenDetails).toHaveBeenCalledTimes(3);
    });

    it('stops polling after 10 attempts', async () => {
      const mockedTimestamp = 1_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(mockedTimestamp * 1000);

      getTokenDetails.mockResolvedValue({
        metadata: {
          metadataLastUpdatedTimestamp: mockedTimestamp - 1_000,
        },
      });

      const glacierService = new GlacierService();

      // expect(...).rejects.toThrow() does not work here for whatever reason.
      try {
        await glacierService.refreshNftMetadata(
          'address',
          'chainId',
          'tokenId'
        );
      } catch (err) {
        expect(err).toEqual('request-timeout');
      }

      expect(getTokenDetails).toHaveBeenCalledTimes(10);
    });
  });

  describe('isNetworkSupported', () => {
    it('returns false if glacier is not healthy', async () => {
      healthCheckMock.mockRejectedValue('some error');

      const glacierService = new GlacierService();
      supportedChainsMock.mockReset(); // It's first called when GlacierService is instantiated, so we need to reset the counter.

      await waitForFirstHealthCheck();

      const result = await glacierService.isNetworkSupported(1);

      expect(result).toBe(false);
      expect(supportedChainsMock).not.toHaveBeenCalled();
    });

    it('returns false if fetching supported chains fails', async () => {
      supportedChainsMock.mockRejectedValue('some error');

      const glacierService = new GlacierService();
      supportedChainsMock.mockReset(); // It's first called when GlacierService is instantiated, so we need to reset the counter.

      await waitForFirstHealthCheck();

      const result = await glacierService.isNetworkSupported(1);

      expect(result).toBe(false);
      expect(supportedChainsMock).toHaveBeenCalledTimes(1);
    });

    it('returns true if the provided chain id is supported', async () => {
      supportedChainsMock.mockResolvedValue({ chains: [{ chainId: '1' }] });

      const glacierService = new GlacierService();
      await waitForFirstHealthCheck();

      const result = await glacierService.isNetworkSupported(1);
      expect(result).toBe(true);
    });

    it('fetches supported chains only once', async () => {
      supportedChainsMock.mockResolvedValue({ chains: [{ chainId: '1' }] });

      const glacierService = new GlacierService();
      await waitForFirstHealthCheck();

      const result_1 = await glacierService.isNetworkSupported(1);
      const result_2 = await glacierService.isNetworkSupported(1);
      const result_3 = await glacierService.isNetworkSupported(1);

      expect([result_1, result_2, result_3]).toStrictEqual([true, true, true]);
      expect(supportedChainsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getChainBalance', () => {
    it('should return response from getBalancesByAddresses', async () => {
      const glacierService = new GlacierService();
      const result = await glacierService.getChainBalance({
        blockchainId: BlockchainId.P_CHAIN,
        network: Network.FUJI,
        addresses: 'address',
      });

      expect(result).toEqual(pchainBalance);
    });
  });
});
