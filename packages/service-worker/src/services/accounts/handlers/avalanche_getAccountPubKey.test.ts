import { DAppProviderRequest } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheGetAccountPubKeyHandler } from './avalanche_getAccountPubKey';
import { buildRpcCall } from '@src/tests/test-utils';

describe('background/services/accounts/handlers/avalanche_getAccountPubKey.ts', () => {
  const publicKeys = {
    evm: 'evmPubKey',
    xp: 'xpPubKey',
  };

  const walletServiceMock = {
    getActiveAccountPublicKey: () => publicKeys,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const request = {
    id: '123',
    method: DAppProviderRequest.AVALANCHE_GET_ACCOUNT_PUB_KEY,
  } as const;
  const walletRequest = {
    id: '123',
    method: DAppProviderRequest.WALLET_GET_PUBKEY,
  } as const;

  describe('handleAuthenticated', () => {
    it('throws if no active account found', async () => {
      const noAccountsMock = {
        getActiveAccountPublicKey: () => {
          throw new Error('No active account.');
        },
      };
      const handler = new AvalancheGetAccountPubKeyHandler(
        noAccountsMock as any,
      );

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toStrictEqual({
        ...request,
        error: ethErrors.rpc.internal('No active account.'),
      });
    });
    it('throws if no active account found with `wallet_getPublicKey` method', async () => {
      const noAccountsMock = {
        getActiveAccountPublicKey: () => {
          throw new Error('No active account.');
        },
      };
      const handler = new AvalancheGetAccountPubKeyHandler(
        noAccountsMock as any,
      );

      const result = await handler.handleAuthenticated(
        buildRpcCall(walletRequest),
      );

      expect(result).toStrictEqual({
        ...walletRequest,
        error: ethErrors.rpc.internal('No active account.'),
      });
    });

    it('returns the public keys correctly', async () => {
      const handler = new AvalancheGetAccountPubKeyHandler(walletServiceMock);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toStrictEqual({
        ...request,
        result: publicKeys,
      });
    });
    it('returns the public keys correctly with `wallet_getPublicKey` method', async () => {
      const handler = new AvalancheGetAccountPubKeyHandler(walletServiceMock);

      const result = await handler.handleAuthenticated(
        buildRpcCall(walletRequest),
      );

      expect(result).toStrictEqual({
        ...walletRequest,
        result: publicKeys,
      });
    });
  });
});
