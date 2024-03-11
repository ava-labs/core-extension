import { DerivationPath } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SecretType } from '../../secrets/models';
import { SeedlessAuthProvider } from '../models';
import { GetWalletDetailsHandler } from './getWalletDetails';

describe('src/background/services/wallet/handlers/getWalletDetails.test.ts', () => {
  const walletServiceMock = {
    wallets: [
      {
        type: SecretType.Mnemonic,
        derivationPath: DerivationPath.BIP44,
      },
    ],
  } as any;

  it('returns the walletType and derivationPath properly', async () => {
    const handler = new GetWalletDetailsHandler(walletServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.WALLET_GET_DETAILS,
    } as any;

    const result = await handler.handle(request);

    expect(result).toStrictEqual({
      ...request,
      result: walletServiceMock.wallets,
    });
  });

  it('returns the authProvider & userEmail & userId for seedless wallets', async () => {
    const handler = new GetWalletDetailsHandler({
      wallets: [
        {
          type: SecretType.Seedless,
          authProvider: SeedlessAuthProvider.Apple,
          derivationPath: DerivationPath.BIP44,
          userEmail: 'abc@xy.z',
          userId: '123',
        },
      ],
    } as any);

    const request = {
      id: '123',
      method: ExtensionRequest.WALLET_GET_DETAILS,
    } as any;

    const result = await handler.handle(request);

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
