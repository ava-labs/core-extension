import wallet_storage_encryption_key_v2 from './wallet_storage_encryption_key_v2';
import Joi from 'joi';

describe('background/services/storage/schemaMigrations/migrations/wallet_storage_encryption_key_v2', () => {
  const validInputEncryptionKey =
    '1111111111111111111111111111111111111111111111111111111111111111';

  it('accepts correct inputs', () => {
    const result = wallet_storage_encryption_key_v2.previousSchema.validate(
      validInputEncryptionKey
    );

    expect(result).toEqual({
      error: undefined,
      value: validInputEncryptionKey,
    });
  });

  it('rejects incorrect inputs', () => {
    const invalidInput = {
      key: '12312',
    };
    const result =
      wallet_storage_encryption_key_v2.previousSchema.validate(invalidInput);

    expect(result).toEqual({
      value: invalidInput,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('migrates to v2 successfully', async () => {
    const result = await wallet_storage_encryption_key_v2.up(
      validInputEncryptionKey
    );
    expect(result).toStrictEqual({
      storageKey: validInputEncryptionKey,
      version: 2,
    });
  });
});
