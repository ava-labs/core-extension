import { Contact } from '@avalabs/types';
import {
  getAddressForChain,
  getContactAddressForChain,
  stripAddressPrefix,
} from '@core/common';
import { Account, NetworkWithCaipId } from '@core/types';

export const getAddressForNetwork = (
  networkId: NetworkWithCaipId,
  account?: Account | Contact,
) => {
  if (!account) {
    return;
  }
  if (isAccount(account)) {
    return stripAddressPrefix(getAddressForChain(networkId, account));
  }
  return getContactAddressForChain(networkId, account);
};

const isAccount = (account: Account | Contact): account is Account => {
  return 'addressC' in account;
};
