import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheGetAccountPubKeyHandler } from './avalanche_getAccountPubKey';

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

  describe('handleAuthenticated', () => {
    it('throws if no active account found', async () => {
      const noAccountsMock = {
        getActiveAccountPublicKey: () => {
          throw new Error('No active account.');
        },
      };
      const handler = new AvalancheGetAccountPubKeyHandler(
        noAccountsMock as any
      );
      const request = {
        id: '123',
        method: DAppProviderRequest.AVALANCHE_GET_ACCOUNT_PUB_KEY,
      } as any;

      const result = await handler.handleAuthenticated(request);

      expect(result).toStrictEqual({
        ...request,
        error: ethErrors.rpc.internal('No active account.'),
      });
    });

    it('returns the public keys correctly', async () => {
      const handler = new AvalancheGetAccountPubKeyHandler(walletServiceMock);
      const request = {
        id: '123',
        method: DAppProviderRequest.AVALANCHE_GET_ACCOUNT_PUB_KEY,
      } as any;

      const result = await handler.handleAuthenticated(request);

      expect(result).toStrictEqual({
        ...request,
        result: publicKeys,
      });
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAccountPubKeyHandler(walletServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
    } as any;

    const result = await handler.handleUnauthenticated(request);
    expect(result).toEqual({
      ...request,
      error: ethErrors.provider.unauthorized(),
    });
  });
});
