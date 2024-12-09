import { AccountType } from '@src/background/services/accounts/models';
import Joi from 'joi';
import accounts_v2 from './accounts_v2';

describe('background/services/storage/schemaMigrations/migrations/accounts_v2', () => {
  const validInput = [
    {
      index: 0,
      name: 'name',
      active: true,
      addressBTC: 'addressBTC',
      addressC: 'addressC',
    },
    {
      index: 1,
      name: 'name 2',
      active: false,
      addressBTC: 'addressBTC',
      addressC: 'addressC',
    },
  ];

  it('accepts correct inputs', () => {
    const result = accounts_v2.previousSchema.validate(validInput);

    expect(result).toEqual({
      error: undefined,
      value: validInput,
    });
  });

  it('accepts inputs with missing addresses', () => {
    const inputWithoutAddresses = validInput.map(({ index, name, active }) => ({
      index,
      name,
      active,
    }));

    const result = accounts_v2.previousSchema.validate(inputWithoutAddresses);

    expect(result).toEqual({
      error: undefined,
      value: inputWithoutAddresses,
    });
  });

  it('rejects incorrect inputs', () => {
    const { index, ...invalidInput } = validInput[0] ?? {};
    const result = accounts_v2.previousSchema.validate(invalidInput);

    expect(result).toEqual({
      value: undefined,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('migrates to v2 successfully', async () => {
    (crypto.randomUUID as jest.Mock)
      .mockReturnValueOnce('uuid1')
      .mockReturnValueOnce('uuid2');

    const result = await accounts_v2.up(validInput);
    expect(result).toStrictEqual({
      active: {
        index: 0,
        id: 'uuid1',
        name: 'name',
        addressBTC: 'addressBTC',
        addressC: 'addressC',
        type: AccountType.PRIMARY,
      },
      primary: [
        {
          index: 0,
          id: 'uuid1',
          name: 'name',
          addressBTC: 'addressBTC',
          addressC: 'addressC',
          type: AccountType.PRIMARY,
        },
        {
          index: 1,
          id: 'uuid2',
          name: 'name 2',
          addressBTC: 'addressBTC',
          addressC: 'addressC',
          type: AccountType.PRIMARY,
        },
      ],
      imported: {},
      version: 2,
    });
  });
});
