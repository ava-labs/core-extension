import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

import { ImportSeedPhraseHandler } from './importSeedPhrase';
import { SeedphraseImportError } from './models';
import { SecretType } from '../../secrets/models';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { buildRpcCall } from '@src/tests/test-utils';

describe('src/background/services/wallet/handlers/importSeedPhrase', () => {
  const walletService = {
    addPrimaryWallet: jest.fn(),
  } as unknown as jest.Mocked<WalletService>;

  const accountsService = {
    addPrimaryAccount: jest.fn(),
  } as unknown as jest.Mocked<AccountsService>;

  const secretsService = {
    isKnownSecret: jest.fn(),
    getWalletAccountsSecretsById: jest.fn(),
  } as unknown as jest.Mocked<SecretsService>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const handle = (params) => {
    const handler = new ImportSeedPhraseHandler(
      walletService,
      accountsService,
      secretsService
    );

    return handler.handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.WALLET_IMPORT_SEED_PHRASE,
        params: [params],
      })
    );
  };

  it('returns an error if the seed phrase is already imported', async () => {
    secretsService.isKnownSecret.mockResolvedValueOnce(true);

    const { error } = await handle({ mnemonic: 'mnemonic' });

    expect(error).toEqual(
      expect.objectContaining({
        data: { reason: SeedphraseImportError.ExistingSeedphrase },
      })
    );
  });

  it('is not case sensitive', async () => {
    const name = 'Dummy mnemonic';
    const mnemonicLowerCase =
      'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit';
    const mnemonicUpperCase = mnemonicLowerCase.toUpperCase();
    const walletId = crypto.randomUUID();

    walletService.addPrimaryWallet.mockResolvedValue(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue({
      name,
    } as any);

    await handle({
      mnemonic: mnemonicLowerCase,
      name,
    });
    await handle({
      mnemonic: mnemonicUpperCase,
      name,
    });

    const expectedCall = {
      secretType: SecretType.Mnemonic,
      mnemonic: mnemonicLowerCase,
      xpub: 'xpub6DPsyHV2MhmxaY7FtPeVVeB1MCZ9XzDhHTHFqzq2BVMKnqCcHjnXCeTZWUbsarGTdWHHz7wFdNfKiggZYabqj3b8FodX7cDryEQgBWqPcY6',
      xpubXP:
        'xpub6CiZCQeZSo8jyK2ARkRKkFvo6rkaA9deyRaKNW2nFsbb8C3cnVLZxYuQ8YRABbBUA47xYd1EHoTqWtFX895Pb2VjcJUFD4kGbmetuh57mry',
      derivationPath: DerivationPath.BIP44,
      name: 'Dummy mnemonic',
    };

    // Expect both calls to be the same despite different casing in the seed phrase
    expect(walletService.addPrimaryWallet).toHaveBeenNthCalledWith(
      1,
      expectedCall
    );
    expect(walletService.addPrimaryWallet).toHaveBeenNthCalledWith(
      2,
      expectedCall
    );
  });

  it('imports seed phrases and derives accounts', async () => {
    const name = 'Dummy mnemonic';
    const mnemonic =
      'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit';
    const walletId = crypto.randomUUID();

    walletService.addPrimaryWallet.mockResolvedValueOnce(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValueOnce({
      name,
    } as any);

    const { result } = await handle({
      mnemonic,
      name,
    });

    expect(walletService.addPrimaryWallet).toHaveBeenCalledWith({
      secretType: SecretType.Mnemonic,
      mnemonic,
      xpub: 'xpub6DPsyHV2MhmxaY7FtPeVVeB1MCZ9XzDhHTHFqzq2BVMKnqCcHjnXCeTZWUbsarGTdWHHz7wFdNfKiggZYabqj3b8FodX7cDryEQgBWqPcY6',
      xpubXP:
        'xpub6CiZCQeZSo8jyK2ARkRKkFvo6rkaA9deyRaKNW2nFsbb8C3cnVLZxYuQ8YRABbBUA47xYd1EHoTqWtFX895Pb2VjcJUFD4kGbmetuh57mry',
      derivationPath: DerivationPath.BIP44,
      name: 'Dummy mnemonic',
    });

    expect(accountsService.addPrimaryAccount).toHaveBeenCalledTimes(3);
    expect(accountsService.addPrimaryAccount).toHaveBeenNthCalledWith(1, {
      walletId,
    });
    expect(accountsService.addPrimaryAccount).toHaveBeenNthCalledWith(2, {
      walletId,
    });
    expect(accountsService.addPrimaryAccount).toHaveBeenNthCalledWith(3, {
      walletId,
    });

    expect(result).toEqual({
      type: SecretType.Mnemonic,
      name,
      walletId,
    });
  });
});