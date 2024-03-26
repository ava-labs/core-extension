import { DerivationPath } from '@avalabs/wallets-sdk';
import Joi from 'joi';
import wallet_v4 from './wallet_v4';
import { ImportType } from '@src/background/services/accounts/models';
import { SecretType } from '@src/background/services/secrets/models';

jest.mock('@avalabs/wallets-sdk');
jest.mock('@src/background/services/wallet/utils/getDerivationPath');

describe('background/services/storage/schemaMigrations/migrations/wallet_v4', () => {
  const validInput = {
    mnemonic: 'mnemonic',
    derivationPath: DerivationPath.BIP44,
    xpub: 'asd',
    xpubXP: 'asd',
    imported: {
      asd: {
        type: ImportType.PRIVATE_KEY,
        secret: 'string',
      },
    },
  };

  it('should accept the correct inputs', () => {
    const result = wallet_v4.previousSchema.validate(validInput);

    expect(result).toEqual({
      error: undefined,
      value: validInput,
    });
  });

  it('should reject the incorrect inputs because of the invalid `derivationPath`', () => {
    const invalidInput = {
      mnemonic: 'mnemonic',
      random: true,
    };
    const result = wallet_v4.previousSchema.validate(invalidInput);

    expect(result).toEqual({
      value: invalidInput,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('should throw an `invalid wallet type` error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { xpub, ...rest } = validInput;
    expect(() => wallet_v4.up(rest)).rejects.toThrow(
      'Cannot get the secret type for a primary account'
    );
  });

  it('alows empty mnemoinic fields', async () => {
    const result = await wallet_v4.up({
      mnemonic: '',
      derivationPath: DerivationPath.BIP44,
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      masterFingerprint: '',
      version: 3,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imported, ...restInput } = validInput;
    expect(result).toStrictEqual({
      wallets: [
        {
          id: 'migrated-wallet-id',
          name: `Ledger 01`,
          secretType: SecretType.Ledger,
          mnemonic: '',
          derivationPath: DerivationPath.BIP44,
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          masterFingerprint: '',
        },
      ],
      importedAccounts: {},
      version: 4,
    });
  });

  it('migrates to v4 successfully', async () => {
    const result = await wallet_v4.up(validInput);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imported, ...restInput } = validInput;
    expect(result).toStrictEqual({
      wallets: [
        {
          ...restInput,
          id: 'migrated-wallet-id',
          secretType: SecretType.Mnemonic,
          name: `Seed Phrase 01`,
        },
      ],
      importedAccounts: {
        asd: {
          secretType: SecretType.PrivateKey,
          secret: 'string',
        },
      },
      version: 4,
    });
  });
});
