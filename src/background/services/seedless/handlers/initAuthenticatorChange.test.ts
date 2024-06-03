import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SeedlessMfaService } from '../SeedlessMfaService';

import { InitAuthenticatorChangeHandler } from './initAuthenticatorChange';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/seedless/handlers/initAuthenticatorChange', () => {
  const seedlessMfaService = jest.mocked<SeedlessMfaService>({
    initAuthenticatorChange: jest.fn(),
  } as any);

  const handle = () => {
    const handler = new InitAuthenticatorChangeHandler(seedlessMfaService);

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_INIT_AUTHENTICATOR_CHANGE,
        id: 'abcd-1234',
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if change initialization fails', async () => {
    seedlessMfaService.initAuthenticatorChange.mockRejectedValueOnce(
      new Error('Session expired')
    );

    const result = await handle();

    expect(result.error).toEqual('Session expired');
  });

  it('returns the TOTP challenge', async () => {
    seedlessMfaService.initAuthenticatorChange.mockResolvedValueOnce({
      totpId: 'totpId',
      totpUrl: 'totpUrl',
    });

    const result = await handle();

    expect(result.result).toEqual({
      totpId: 'totpId',
      totpUrl: 'totpUrl',
    });
  });
});
