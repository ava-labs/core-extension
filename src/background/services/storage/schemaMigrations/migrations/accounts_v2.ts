import Joi from 'joi';
import {
  AccountStorageItem,
  AccountType,
  FireblocksAccount,
  ImportedAccount,
  WalletConnectAccount,
} from '@src/background/services/accounts/models';

const VERSION = 2;

type PreviousSchema = {
  index: number;
  name: string;
  active: boolean;
  addressBTC?: string;
  addressC?: string;
}[];

interface PrimaryAccount extends AccountStorageItem {
  index: number;
  type: AccountType.PRIMARY;
  addressBTC: string;
}

type Account = PrimaryAccount | ImportedAccount;

type PreviousSchemaV2 = {
  active?: Account;
  primary: PrimaryAccount[];
  imported: Record<
    string,
    ImportedAccount | WalletConnectAccount | FireblocksAccount
  >;
};
type AccountsV2 = PreviousSchemaV2;

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
  const newData = accounts.reduce<AccountsV2>(
    (acc, primaryAccount) => {
      const { active, ...account } = {
        ...primaryAccount,
        id: crypto.randomUUID(),
        type: AccountType.PRIMARY,
        addressC: primaryAccount.addressC ?? '',
        addressBTC: primaryAccount.addressBTC ?? '',
      };

      if (active) {
        acc.active = account as PrimaryAccount;
      }

      acc.primary.push(account as PrimaryAccount);

      return acc;
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
