import { Account } from '@core/types';
import {
  Caip2IdAccountTypeMap,
  NameSpaceAccountTypeMap,
} from '~/api-clients/constants';

interface GetAccountAddressFromCaip2IdOrNamesSpaceProps {
  account: Account;
  caip2Id: string;
  nameSpace?: string;
}

export const getAccountAddressFromCaip2IdOrNamesSpace = ({
  account,
  caip2Id,
  nameSpace,
}: GetAccountAddressFromCaip2IdOrNamesSpaceProps): string | null => {
  if (!nameSpace) {
    return null;
  }

  const accountTypeByCaip2Id = Caip2IdAccountTypeMap[caip2Id];

  if (accountTypeByCaip2Id) {
    return account[accountTypeByCaip2Id] ?? null;
  }

  const accountTypeByNameSpace = NameSpaceAccountTypeMap[nameSpace];
  if (accountTypeByNameSpace) {
    return account[accountTypeByNameSpace] ?? null;
  }

  return null;
};
