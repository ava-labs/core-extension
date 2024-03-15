import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { SeedlessMfaService } from '../SeedlessMfaService';

import { CompleteAuthenticatorChangeHandler } from './completeAuthenticatorChange';

describe('src/background/services/seedless/handlers/completeAuthenticatorChange', () => {
  const seedlessMfaService = jest.mocked<SeedlessMfaService>({
    completeAuthenticatorChange: jest.fn(),
  } as any);

  const handle = () => {
    const handler = new CompleteAuthenticatorChangeHandler(seedlessMfaService);

    return handler.handle({
      method: ExtensionRequest.SEEDLESS_COMPLETE_AUTHENTICATOR_CHANGE,
      id: 'abcd-1234',
      params: ['totpId', '123456'],
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if change completion fails', async () => {
    seedlessMfaService.completeAuthenticatorChange.mockRejectedValueOnce(
      new Error('Session expired')
    );

    const result = await handle();

    expect(result.error).toEqual('Session expired');
  });
});
