import { Account } from '@core/types';
import {
  Caip2IdAccountTypeMap,
  NameSpaceAccountTypeMap,
} from '~/api-clients/constants';

interface GetAccountAddressForCaip2IdentifierParams {
  account: Account;
  caip2Id: string;
  nameSpace: string;
}

export const getAccountAddressForCaip2Identifier = ({
  account,
  caip2Id,
  nameSpace,
}: GetAccountAddressForCaip2IdentifierParams): string | null => {
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
