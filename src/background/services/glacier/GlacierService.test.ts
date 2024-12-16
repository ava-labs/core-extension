import {
  Glacier,
  Network as GlacierNetwork,
  PrimaryNetworkChainName,
} from '@avalabs/glacier-sdk';
import { GlacierService } from './GlacierService';

import { wait } from '@avalabs/core-utils-sdk';

jest.mock('@avalabs/glacier-sdk');
jest.mock('@avalabs/core-utils-sdk', () => ({
  ...jest.requireActual('@avalabs/core-utils-sdk'),
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
    network: GlacierNetwork.FUJI,
  },
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
          'tokenId',
        );
      } catch (err) {
        expect(err).toEqual('request-timeout');
      }

      expect(getTokenDetails).toHaveBeenCalledTimes(10);
    });
  });
});
