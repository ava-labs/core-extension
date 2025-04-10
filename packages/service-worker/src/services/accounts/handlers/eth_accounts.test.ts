import { DAppProviderRequest } from 'packages/service-worker/src/connections/dAppConnection/models';
import { EthAccountsHandler } from './eth_accounts';
import { buildRpcCall } from '@src/tests/test-utils';

describe('background/services/accounts/handlers/eth_accounts.ts', () => {
  const accountServiceMock = {
    activeAccount: {
      index: 1,
      addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  } as any;

  const request = {
    id: '123',
    method: DAppProviderRequest.ETH_ACCOUNTS,
  } as const;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('error, no active account', async () => {
      const handler = new EthAccountsHandler({
        activeAccount: undefined,
      } as any);

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: 'wallet locked, undefined or malformed',
      });
    });

    it('returns the active account EVM address', async () => {
      const handler = new EthAccountsHandler(accountServiceMock);
      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        result: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
      });
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new EthAccountsHandler(accountServiceMock);
    const result = await handler.handleUnauthenticated(buildRpcCall(request));

    expect(result).toEqual({
      ...request,
      result: [],
    });
  });
});
