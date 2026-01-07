import { ChainId } from '@avalabs/core-chains-sdk';
import { ConnectionInfo, Web3Event } from '@core/types';
import { NetworkService } from '../NetworkService';
import { SettingsService } from '~/services/settings/SettingsService';
import { NetworkStateChangedEvents } from './networkStateChanged';

// Mock the services and utility function
jest.mock('../NetworkService');
jest.mock('~/services/settings/SettingsService');
jest.mock('../utils/getNetworkStateWithTokenvisibility');

const { getNetworkStateWithTokenvisibility } = jest.requireMock(
  '../utils/getNetworkStateWithTokenvisibility',
);

describe('background/services/network/events/networkStateChanged.ts', () => {
  let mockNetworkService: jest.Mocked<NetworkService>;
  let mockSettingsService: jest.Mocked<SettingsService>;
  let networkStateChangedEvents: NetworkStateChangedEvents;

  const mockNetworkStateData = [
    {
      caip2ChainId: `eip155:${ChainId.AVALANCHE_MAINNET_ID}`,
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      name: 'Avalanche C-Chain',
      logoUrl: 'https://example.com/avalanche-logo.png',
      explorerUrl: 'https://snowtrace.io',
      networkToken: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
      },
      enabledTokens: ['0x1c7d4b196cb0c7b01d743fbc6116a902379c7238'],
      disabledTokens: ['0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'],
    },
    {
      caip2ChainId: 'eip155:1',
      rpcUrl: 'https://mainnet.infura.io/v3/key',
      name: 'Ethereum Mainnet',
      logoUrl: 'https://example.com/ethereum-logo.png',
      explorerUrl: 'https://etherscan.io',
      networkToken: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      enabledTokens: ['0x6b175474e89094c44da98b954eedeac495271d0f'],
      disabledTokens: ['0xa0b86a33e6e9c6c1b1a5edc7e3d9a83c8f2f8d'],
    },
  ];

  const mockSyncConnectionInfo: ConnectionInfo = {
    domain: 'core.app',
    tabId: 123,
  };

  const mockNonSyncConnectionInfo: ConnectionInfo = {
    domain: 'example.com',
    tabId: 456,
  };

  beforeEach(() => {
    jest.resetAllMocks();

    // Create mocked instances
    mockNetworkService = new NetworkService(
      {} as any,
      {} as any,
      {} as any,
    ) as jest.Mocked<NetworkService>;

    mockSettingsService = new SettingsService(
      {} as any,
      {} as any,
      {} as any,
    ) as jest.Mocked<SettingsService>;

    networkStateChangedEvents = new NetworkStateChangedEvents(
      mockNetworkService,
      mockSettingsService,
    );
  });

  describe('sendUpdateEvent (settings updated)', () => {
    beforeEach(() => {
      getNetworkStateWithTokenvisibility.mockResolvedValue(
        mockNetworkStateData,
      );
    });

    it('emits update event when settings change and domain is sync domain', (done) => {
      networkStateChangedEvents.setConnectionInfo(mockSyncConnectionInfo);

      // Listen for the update event
      networkStateChangedEvents.addListener((event: any) => {
        expect(event.method).toBe(Web3Event.NETWORK_STATE_CHANGED);
        expect(event.params).toEqual({ networks: mockNetworkStateData });
        expect(getNetworkStateWithTokenvisibility).toHaveBeenCalledWith(
          mockNetworkService,
          mockSettingsService,
        );
        done();
      });

      // Trigger the settings update by getting the listener and calling it
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      settingsListener();
    });

    it('does not emit update event when domain is not sync domain', async () => {
      networkStateChangedEvents.setConnectionInfo(mockNonSyncConnectionInfo);

      const eventHandler = jest.fn();
      networkStateChangedEvents.addListener(eventHandler);

      // Trigger the settings update
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      await settingsListener();

      expect(eventHandler).not.toHaveBeenCalled();
      expect(getNetworkStateWithTokenvisibility).not.toHaveBeenCalled();
    });

    it('does not emit update event when connection info is not set', async () => {
      const eventHandler = jest.fn();
      networkStateChangedEvents.addListener(eventHandler);

      // Trigger the settings update without setting connection info
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      await settingsListener();

      expect(eventHandler).not.toHaveBeenCalled();
      expect(getNetworkStateWithTokenvisibility).not.toHaveBeenCalled();
    });

    it('handles errors gracefully and logs them', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Network state error');
      getNetworkStateWithTokenvisibility.mockRejectedValue(error);

      networkStateChangedEvents.setConnectionInfo(mockSyncConnectionInfo);

      const eventHandler = jest.fn();
      networkStateChangedEvents.addListener(eventHandler);

      // Trigger the settings update
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      await settingsListener();

      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(eventHandler).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('addListener and removeListener', () => {
    it('adds and removes event listeners correctly', async () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      // Add listeners
      networkStateChangedEvents.addListener(handler1);
      networkStateChangedEvents.addListener(handler2);

      // Both should not be called initially
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();

      // Remove one listener
      networkStateChangedEvents.removeListener(handler1);

      // Set up mock for event emission
      getNetworkStateWithTokenvisibility.mockResolvedValue(
        mockNetworkStateData,
      );
      networkStateChangedEvents.setConnectionInfo(mockSyncConnectionInfo);

      // Trigger event
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      await settingsListener();

      // Wait a bit for async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Only handler2 should have been called
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles empty network state data', (done) => {
      getNetworkStateWithTokenvisibility.mockResolvedValue([]);
      networkStateChangedEvents.setConnectionInfo(mockSyncConnectionInfo);

      networkStateChangedEvents.addListener((event: any) => {
        expect(event.method).toBe(Web3Event.NETWORK_STATE_CHANGED);
        expect(event.params).toEqual({ networks: [] });
        done();
      });

      // Trigger the event
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      settingsListener();
    });

    it('handles connection info with empty domain', async () => {
      const connectionInfoWithEmptyDomain: ConnectionInfo = {
        ...mockSyncConnectionInfo,
        domain: '',
      };
      networkStateChangedEvents.setConnectionInfo(
        connectionInfoWithEmptyDomain,
      );

      const eventHandler = jest.fn();
      networkStateChangedEvents.addListener(eventHandler);

      // Trigger the settings update
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      await settingsListener();

      expect(eventHandler).not.toHaveBeenCalled();
      expect(getNetworkStateWithTokenvisibility).not.toHaveBeenCalled();
    });

    it('handles connection info with undefined domain', async () => {
      const connectionInfoWithUndefinedDomain: ConnectionInfo = {
        ...mockSyncConnectionInfo,
        domain: undefined as any,
      };
      networkStateChangedEvents.setConnectionInfo(
        connectionInfoWithUndefinedDomain,
      );

      const eventHandler = jest.fn();
      networkStateChangedEvents.addListener(eventHandler);

      // Trigger the settings update
      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];
      await settingsListener();

      expect(eventHandler).not.toHaveBeenCalled();
      expect(getNetworkStateWithTokenvisibility).not.toHaveBeenCalled();
    });

    it('handles multiple rapid updates without race conditions', async () => {
      getNetworkStateWithTokenvisibility.mockResolvedValue(
        mockNetworkStateData,
      );
      networkStateChangedEvents.setConnectionInfo(mockSyncConnectionInfo);

      const eventHandler = jest.fn();
      networkStateChangedEvents.addListener(eventHandler);

      const settingsListener = (mockSettingsService.addListener as jest.Mock)
        .mock.calls[0][1];

      // Trigger multiple updates rapidly
      const promises = [settingsListener(), settingsListener()];

      await Promise.all(promises);

      // Wait for all async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 20));

      // Event handler should have been called multiple times
      expect(eventHandler.mock.calls.length).toBeGreaterThan(0);
      expect(getNetworkStateWithTokenvisibility).toHaveBeenCalled();
    });
  });
});
