import { ImportedAccount, PrimaryAccount } from '@core/types';

export type AccountGroup = {
  id: string;
  name: string;
  items: (PrimaryAccount | ImportedAccount)[];
};
