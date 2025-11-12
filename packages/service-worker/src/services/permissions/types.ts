import { Account } from '@core/types';
import { NetworkVMType } from '@avalabs/vm-module-types';

export type AccountSetting = {
  account: Account;
  enabled: boolean;
};
export type GrantAccessToAccountsOptions = {
  domain: string;
  accounts: AccountSetting[];
  notifiedVMConnectors: NetworkVMType[];
};
