import wallet_v2 from './wallet_v2';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import Joi from 'joi';
jest.mock('@avalabs/core-wallets-sdk');

describe('background/services/storage/schemaMigrations/migrations/wallet_v2', () => {
  const validInputMnemonic = {
    mnemonic: 'mnemonic',
    xpub: 'xpub',
    pubKeys: undefined,
  };

  it('accepts correct inputs', () => {
    const result = wallet_v2.previousSchema.validate(validInputMnemonic);

    expect(result).toEqual({
      error: undefined,
      value: validInputMnemonic,
    });
  });

  it('rejects incorrect inputs', () => {
    const invalidInput = ['foo'];
    const result = wallet_v2.previousSchema.validate(invalidInput);

    expect(result).toEqual({
      value: invalidInput,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('migrates to v2 successfully', async () => {
    (Avalanche.getXpubFromMnemonic as jest.Mock).mockReturnValueOnce('xpubXP');

    const result = await wallet_v2.up(validInputMnemonic);
    expect(result).toStrictEqual({
      mnemonic: 'mnemonic',
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      pubKeys: undefined,
      version: 2,
    });
  });
});
