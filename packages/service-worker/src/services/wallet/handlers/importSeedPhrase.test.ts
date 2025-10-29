import {
  ExtensionRequest,
  SecretType,
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  SeedphraseImportError,
} from '@core/types';

import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';

import { ImportSeedPhraseHandler } from './importSeedPhrase';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { buildRpcCall } from '@shared/tests/test-utils';
import { buildExtendedPublicKey } from '../../secrets/utils';
import { addAllAccountsWithHistory } from '~/services/accounts/utils/addAllAccountsWithHistory';

jest.mock('~/services/accounts/utils/addAllAccountsWithHistory', () => ({
  addAllAccountsWithHistory: jest.fn(),
}));

describe('src/background/services/wallet/handlers/importSeedPhrase', () => {
  const walletService = {
    addPrimaryWallet: jest.fn(),
  } as unknown as jest.Mocked<WalletService>;

  const accountsService = {
    addPrimaryAccount: jest.fn(),
    activateAccount: jest.fn(),
  } as unknown as jest.Mocked<AccountsService>;

  const secretsService = {
    isKnownSecret: jest.fn(),
    getWalletAccountsSecretsById: jest.fn(),
  } as unknown as jest.Mocked<SecretsService>;

  beforeEach(() => {
    jest.resetAllMocks();
    (addAllAccountsWithHistory as jest.Mock).mockResolvedValue(['1', '2', '3']);
  });

  const handle = (params) => {
    const handler = new ImportSeedPhraseHandler(
      walletService,
      accountsService,
      secretsService,
    );

    return handler.handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.WALLET_IMPORT_SEED_PHRASE,
        params: [params],
      }),
    );
  };

  it('returns an error if the seed phrase is already imported', async () => {
    secretsService.isKnownSecret.mockResolvedValueOnce(true);

    const { error } = await handle({ mnemonic: 'mnemonic' });

    expect(error).toEqual(
      expect.objectContaining({
        data: { reason: SeedphraseImportError.ExistingSeedphrase },
      }),
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
      extendedPublicKeys: [
        buildExtendedPublicKey(
          'xpub6DPsyHV2MhmxaY7FtPeVVeB1MCZ9XzDhHTHFqzq2BVMKnqCcHjnXCeTZWUbsarGTdWHHz7wFdNfKiggZYabqj3b8FodX7cDryEQgBWqPcY6',
          EVM_BASE_DERIVATION_PATH,
        ),
        buildExtendedPublicKey(
          'xpub6CiZCQeZSo8jyK2ARkRKkFvo6rkaA9deyRaKNW2nFsbb8C3cnVLZxYuQ8YRABbBUA47xYd1EHoTqWtFX895Pb2VjcJUFD4kGbmetuh57mry',
          AVALANCHE_BASE_DERIVATION_PATH,
        ),
      ],
      publicKeys: [],
      derivationPathSpec: DerivationPath.BIP44,
      name: 'Dummy mnemonic',
    };

    // Expect both calls to be the same despite different casing in the seed phrase
    expect(walletService.addPrimaryWallet).toHaveBeenNthCalledWith(
      1,
      expectedCall,
    );
    expect(walletService.addPrimaryWallet).toHaveBeenNthCalledWith(
      2,
      expectedCall,
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
      publicKeys: [],
      extendedPublicKeys: [
        buildExtendedPublicKey(
          'xpub6DPsyHV2MhmxaY7FtPeVVeB1MCZ9XzDhHTHFqzq2BVMKnqCcHjnXCeTZWUbsarGTdWHHz7wFdNfKiggZYabqj3b8FodX7cDryEQgBWqPcY6',
          EVM_BASE_DERIVATION_PATH,
        ),
        buildExtendedPublicKey(
          'xpub6CiZCQeZSo8jyK2ARkRKkFvo6rkaA9deyRaKNW2nFsbb8C3cnVLZxYuQ8YRABbBUA47xYd1EHoTqWtFX895Pb2VjcJUFD4kGbmetuh57mry',
          AVALANCHE_BASE_DERIVATION_PATH,
        ),
      ],
      derivationPathSpec: DerivationPath.BIP44,
      name: 'Dummy mnemonic',
    });

    expect(addAllAccountsWithHistory).toHaveBeenCalledWith({
      addFirstAccount: true,
      walletId,
    });

    expect(accountsService.activateAccount).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      type: SecretType.Mnemonic,
      name,
      walletId,
    });
  });
});
