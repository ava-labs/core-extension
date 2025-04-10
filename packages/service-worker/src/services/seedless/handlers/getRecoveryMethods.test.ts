import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';

import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { SeedlessMfaService } from '../SeedlessMfaService';

import { GetRecoveryMethodsHandler } from './getRecoveryMethods';
import { MfaRequestType } from '../models';
import { buildRpcCall } from '@src/tests/test-utils';
import { AccountsService } from '../../accounts/AccountsService';

describe('src/background/services/seedless/handlers/getRecoveryMethods', () => {
  const seedlessMfaService = jest.mocked<SeedlessMfaService>({
    getRecoveryMethods: jest.fn(),
  } as any);

  const secretsService = jest.mocked<SecretsService>({
    getPrimaryAccountSecrets: jest.fn(),
  } as any);

  const accountsService = jest.mocked<AccountsService>({} as any);

  const handle = () => {
    const handler = new GetRecoveryMethodsHandler(
      secretsService,
      seedlessMfaService,
      accountsService,
    );

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_GET_RECOVERY_METHODS,
        id: 'abcd-1234',
      }),
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('for non-seedless wallets', () => {
    beforeEach(() => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
        secretType: SecretType.Mnemonic,
      } as any);
    });

    it('returns an empty array', async () => {
      const result = await handle();

      expect(result.result).toEqual([]);
    });
  });

  it('returns error if fetching the information fails', async () => {
    secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
      secretType: SecretType.Seedless,
    } as any);

    seedlessMfaService.getRecoveryMethods.mockRejectedValueOnce(
      new Error('Session expired'),
    );

    const result = await handle();

    expect(result.error).toEqual('Session expired');
  });

  it('returns configured mfa methods', async () => {
    secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
      secretType: SecretType.Seedless,
    } as any);
    seedlessMfaService.getRecoveryMethods.mockResolvedValueOnce([
      { type: MfaRequestType.Totp },
    ]);

    const result = await handle();

    expect(result.result).toEqual([{ type: MfaRequestType.Totp }]);
  });
});
