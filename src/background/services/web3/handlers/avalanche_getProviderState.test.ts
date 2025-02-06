import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AvalancheGetProviderState } from './avalanche_getProviderState';
import type { NetworkService } from '../../network/NetworkService';
import type { AccountsService } from '../../accounts/AccountsService';
import { buildRpcCall } from '@src/tests/test-utils';

describe('background/services/web3/handlers/avalanche_getProviderState.ts', () => {
  const mockRequest = {
    id: '1234',
    method: DAppProviderRequest.INIT_DAPP_STATE,
    site: {
      domain: 'core.app',
    },
  };

  describe('handleUnauthenticated', () => {
    it('returns loading state when no network and no accounts even if present', async () => {
      const networkService = {
        getAvalancheNetwork: async () => undefined,
        getInitialNetworkForDapp: () => undefined,
      } as unknown as NetworkService;
      const handler = new AvalancheGetProviderState(networkService, {
        activeAccount: { addressC: '0x000000' },
      } as AccountsService);

      expect(
        await handler.handleUnauthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        result: {
          accounts: [],
          chainId: '0x0',
          isUnlocked: false,
          networkVersion: 'loading',
        },
      });
    });

    it('returns network info and no accounts even if present', async () => {
      const handler = new AvalancheGetProviderState(
        {
          getInitialNetworkForDapp: () => ({ chainId: 1 }),
        } as unknown as NetworkService,
        { activeAccount: { addressC: '0x000000' } } as AccountsService,
      );

      expect(
        await handler.handleUnauthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        result: {
          accounts: [],
          chainId: '0x1',
          isUnlocked: false,
          networkVersion: '1',
        },
      });
    });
  });

  describe('handleAuthenticated', () => {
    it('returns loading state when no network', async () => {
      const networkService = {
        getInitialNetworkForDapp: () => undefined,
      } as unknown as NetworkService;

      const handler = new AvalancheGetProviderState(networkService, {
        activeAccount: { addressC: '0x000000' },
      } as AccountsService);

      expect(
        await handler.handleAuthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        result: {
          accounts: ['0x000000'],
          chainId: '0x0',
          isUnlocked: true,
          networkVersion: 'loading',
        },
      });
    });

    it('returns network info', async () => {
      const handler = new AvalancheGetProviderState(
        {
          getInitialNetworkForDapp: () => ({ chainId: 1 }),
        } as unknown as NetworkService,
        { activeAccount: { addressC: '0x000000' } } as AccountsService,
      );

      expect(
        await handler.handleAuthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        result: {
          accounts: ['0x000000'],
          chainId: '0x1',
          isUnlocked: true,
          networkVersion: '1',
        },
      });
    });

    it('returns empty array if account is not set', async () => {
      const handler = new AvalancheGetProviderState(
        {
          getInitialNetworkForDapp: () => ({ chainId: 43114 }),
        } as unknown as NetworkService,
        { activeAccount: undefined } as AccountsService,
      );

      expect(
        await handler.handleAuthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        result: {
          accounts: [],
          chainId: '0xa86a',
          isUnlocked: true,
          networkVersion: '43114',
        },
      });
    });
  });
});
