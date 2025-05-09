import wallet_v3 from './wallet_v3';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import Joi from 'joi';
import getDerivationPath from '~/services/wallet/utils/getDerivationPath';

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('~/services/wallet/utils/getDerivationPath');

describe('background/services/storage/schemaMigrations/migrations/wallet_v3', () => {
  const validInputMnemonic = {
    mnemonic: 'mnemonic',
  };

  it('accepts correct inputs', () => {
    const result = wallet_v3.previousSchema.validate(validInputMnemonic);

    expect(result).toEqual({
      error: undefined,
      value: validInputMnemonic,
    });
  });

  it('rejects incorrect inputs', () => {
    const invalidInput = ['foo'];
    const result = wallet_v3.previousSchema.validate(invalidInput);

    expect(result).toEqual({
      value: invalidInput,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('migrates to v2 successfully', async () => {
    (getDerivationPath as jest.Mock).mockReturnValue(DerivationPath.BIP44);

    const result = await wallet_v3.up(validInputMnemonic);
    expect(result).toStrictEqual({
      derivationPath: DerivationPath.BIP44,
      mnemonic: 'mnemonic',
      version: 3,
    });
  });
});
