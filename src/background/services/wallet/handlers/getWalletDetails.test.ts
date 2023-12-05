import { DerivationPath } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SeedlessAuthProvider, WalletType } from '../models';
import { GetWalletDetailsHandler } from './getWalletDetails';

describe('src/background/services/wallet/handlers/getWalletDetails.test.ts', () => {
  const walletServiceMock = {
    walletDetails: {
      type: WalletType.MNEMONIC,
      derivationPath: DerivationPath.BIP44,
    },
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
      result: walletServiceMock.walletDetails,
    });
  });

  it('returns the authProvider & userEmail for seedless wallets', async () => {
    const handler = new GetWalletDetailsHandler({
      walletDetails: {
        type: WalletType.SEEDLESS,
        authProvider: SeedlessAuthProvider.Apple,
        derivationPath: DerivationPath.BIP44,
        userEmail: 'abc@xy.z',
      },
    } as any);

    const request = {
      id: '123',
      method: ExtensionRequest.WALLET_GET_DETAILS,
    } as any;

    const result = await handler.handle(request);

    expect(result).toStrictEqual({
      ...request,
      result: {
        authProvider: SeedlessAuthProvider.Apple,
        type: WalletType.SEEDLESS,
        derivationPath: DerivationPath.BIP44,
        userEmail: 'abc@xy.z',
      },
    });
  });
});
