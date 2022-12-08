import Joi from 'joi';
import {
  Accounts,
  AccountType,
  PrimaryAccount,
} from '@src/background/services/accounts/models';

const VERSION = 2;

type PreviousSchema = {
  index: number;
  name: string;
  active: boolean;
  addressBTC?: string;
  addressC?: string;
}[];

const previousSchema = Joi.array<PreviousSchema>().items(
  Joi.object({
    index: Joi.number().required(),
    name: Joi.string().required(),
    active: Joi.boolean().required(),
    addressBTC: Joi.string(),
    addressC: Joi.string(),
  })
);

const up = async (accounts: PreviousSchema) => {
  const newData = accounts.reduce<Accounts>(
    (accounts, primaryAccount) => {
      const { active, ...account } = {
        ...primaryAccount,
        id: crypto.randomUUID(),
        type: AccountType.PRIMARY,
        addressC: primaryAccount.addressC ?? '',
        addressBTC: primaryAccount.addressBTC ?? '',
      };

      if (active) {
        accounts.active = account as PrimaryAccount;
      }

      accounts.primary.push(account as PrimaryAccount);

      return accounts;
    },
    {
      active: undefined,
      primary: [],
      imported: {},
    }
  );

  return { ...newData, version: VERSION };
};

export default {
  previousSchema,
  up,
};
