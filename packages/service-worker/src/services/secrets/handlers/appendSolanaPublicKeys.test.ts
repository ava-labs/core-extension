import { buildRpcCall } from '@shared/tests/test-utils';
import { ExtensionRequest } from '@core/types';

import { SecretsService } from '../SecretsService';
import { AddressPublicKey } from '../AddressPublicKey';
import { AccountsService } from '../../accounts/AccountsService';
import { AppendSolanaPublicKeysHandler } from './appendSolanaPublicKeys';

jest.mock('../../accounts/AccountsService');
jest.mock('../SecretsService');
jest.mock('../AddressPublicKey');

describe('src/background/services/accounts/handlers/appendSolanaPublicKeysHandler', () => {
  const accountsService: jest.Mocked<AccountsService> = {
    getPrimaryAccountsByWalletId: jest.fn(),
    refreshAddressesForAccount: jest.fn(),
  } as any;
  const secretsService: jest.Mocked<SecretsService> = {
    appendPublicKeys: jest.fn(),
  } as any;
  const walletId = 'wallet123';

  const handle = () => {
    const handler = new AppendSolanaPublicKeysHandler(
      accountsService,
      secretsService,
    );

    return handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SECRETS_APPEND_SOLANA_PUBLIC_KEYS,
        id: 'abcd-1234',
        params: {
          publicKeys: [
            { index: 0, key: 'key1' },
            { index: 1, key: 'key2' },
          ],
          walletId,
        },
      }),
    );
  };

  it("appends public keys and refreshes affected wallet's addresses", async () => {
    const mockAccounts = [{ id: 'account1' }, { id: 'account2' }] as any;
    const mockAddressPublicKeys = [
      { curve: 'ed25519', derivationPath: "m/44'/501'/0'/0'", key: 'key1' },
      { curve: 'ed25519', derivationPath: "m/44'/501'/1'/0'", key: 'key2' },
    ];

    (AddressPublicKey.fromJSON as jest.Mock).mockImplementation((data) => ({
      toJSON: () => data,
    }));
    accountsService.getPrimaryAccountsByWalletId.mockReturnValue(mockAccounts);

    secretsService.appendPublicKeys.mockResolvedValue(walletId);

    accountsService.refreshAddressesForAccount.mockResolvedValue(undefined);

    await handle();

    expect(AddressPublicKey.fromJSON).toHaveBeenCalledTimes(2);
    expect(secretsService.appendPublicKeys).toHaveBeenCalledWith(
      'wallet123',
      mockAddressPublicKeys,
    );
    expect(accountsService.refreshAddressesForAccount).toHaveBeenCalledTimes(2);
    expect(accountsService.refreshAddressesForAccount).toHaveBeenNthCalledWith(
      1,
      mockAccounts[0].id,
    );
    expect(accountsService.refreshAddressesForAccount).toHaveBeenNthCalledWith(
      2,
      mockAccounts[1].id,
    );
  });

  it('should return an error if an exception occurs', async () => {
    const mockError = new Error('Something went wrong');
    secretsService.appendPublicKeys.mockRejectedValue(mockError);

    const result = await handle();

    expect(result).toEqual(
      expect.objectContaining({
        error: mockError.toString(),
      }),
    );
  });
});
