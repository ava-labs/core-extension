import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { ExtensionRequest } from 'packages/service-worker/src/connections/extensionConnection/models';
import { SecretType } from '../../secrets/models';
import { SeedlessAuthProvider } from '@core/types/src/models';
import { GetWalletDetailsHandler } from './getWalletDetails';
import { buildRpcCall } from '@src/tests/test-utils';
import { SecretsService } from '../../secrets/SecretsService';

jest.mock('../../secrets/SecretsService');
describe('src/background/services/wallet/handlers/getWalletDetails.test.ts', () => {
  const secretsService = new SecretsService({} as any);

  it('should call the `secretsService` properly', async () => {
    const handler = new GetWalletDetailsHandler(secretsService);
    const request = {
      id: '123',
      method: ExtensionRequest.WALLET_GET_DETAILS,
    } as any;
    secretsService.getPrimaryWalletsDetails = jest.fn();

    await handler.handle(buildRpcCall(request));

    expect(secretsService.getPrimaryWalletsDetails).toHaveBeenCalled();
  });

  it('returns the authProvider & userEmail & userId for seedless wallets', async () => {
    const handler = new GetWalletDetailsHandler(secretsService);

    secretsService.getPrimaryWalletsDetails = jest.fn().mockResolvedValue([
      {
        authProvider: SeedlessAuthProvider.Apple,
        type: SecretType.Seedless,
        derivationPath: DerivationPath.BIP44,
        userEmail: 'abc@xy.z',
        userId: '123',
      },
    ]);

    const request = {
      id: '123',
      method: ExtensionRequest.WALLET_GET_DETAILS,
    } as any;

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toStrictEqual({
      ...request,
      result: [
        {
          authProvider: SeedlessAuthProvider.Apple,
          type: SecretType.Seedless,
          derivationPath: DerivationPath.BIP44,
          userEmail: 'abc@xy.z',
          userId: '123',
        },
      ],
    });
  });
});
