import { DerivationPath } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletType } from '../models';
import { GetWalletDetailsHandler } from './getWalletDetails';

describe('src/background/services/wallet/handlers/getWalletDetails.test.ts', () => {
  const walletServiceMock = {
    walletType: WalletType.MNEMONIC,
    derivationPath: DerivationPath.BIP44,
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
      result: {
        walletType: walletServiceMock.walletType,
        derivationPath: walletServiceMock.derivationPath,
      },
    });
  });
});
