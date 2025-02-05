import Joi from 'joi';
import type {
  FireblocksAccount,
  ImportedAccount,
  WalletConnectAccount,
} from '@src/background/services/accounts/models';
import { AccountType } from '@src/background/services/accounts/models';
import { WALLET_ID } from '../models';

const VERSION = 3;

interface AccountStorageItem {
  id: string;
  name: string;
  addressBTC?: string;
  addressC: string;
  addressAVM?: string;
  addressPVM?: string;
  addressCoreEth?: string;
  type?: AccountType;
}

export interface PrimaryAccount extends AccountStorageItem {
  index: number;
  type: AccountType.PRIMARY;
  addressBTC: string;
}

type Account = PrimaryAccount | ImportedAccount;

type PreviousSchema = {
  active?: Account;
  primary: PrimaryAccount[];
  imported: Record<
    string,
    ImportedAccount | WalletConnectAccount | FireblocksAccount
  >;
};
export type AccountsV2 = PreviousSchema;

const previousSchema = Joi.object<PreviousSchema>({
  active: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    addressC: Joi.string().allow('').required(),
    type: Joi.string().valid(...Object.values(AccountType)),
    index: Joi.number(),
    addressBTC: Joi.string().allow(''),
    addressAVM: Joi.string(),
    addressPVM: Joi.string(),
    addressCoreEth: Joi.string(),
  }).unknown(),
  primary: Joi.array<PrimaryAccount>()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        addressC: Joi.string().allow('').required(),
        type: Joi.string().valid(AccountType.PRIMARY),
        index: Joi.number(),
        addressBTC: Joi.string().allow(''),
        addressAVM: Joi.string(),
        addressPVM: Joi.string(),
        addressCoreEth: Joi.string(),
      })
        .required()
        .unknown(),
    )
    .required(),
  imported: Joi.object().unknown(),
}).unknown();

const up = async (accounts: PreviousSchema) => {
  const walletId = WALLET_ID;

  let activeAccount = {
    ...accounts.active,
  };
  if (accounts.active?.type === AccountType.PRIMARY) {
    activeAccount = {
      ...accounts.active,
      walletId,
    };
  }

  const primaryAccounts = accounts.primary.map((acc) => ({ ...acc, walletId }));

  return {
    active: { ...activeAccount },
    imported: { ...accounts.imported },
    primary: {
      [walletId]: primaryAccounts,
    },
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
