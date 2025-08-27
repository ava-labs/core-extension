import { AddressType } from '@core/types';
import {
  isValidAddress,
  isValidPvmAddress,
  isValidAvmAddress,
  isValidBtcAddress,
  isValidSvmAddress,
} from '@core/common';
import { useAccountsContext, useContactsContext } from '@core/ui';

import { getAddressByType } from '@/utils/getAddressByType';

import { Recipient } from '../types';
import { buildRecipient } from '../lib/buildRecipient';
import { getContactAddressByType } from '../lib/getContactAddressByType';

export const useRecipients = (
  addressType: AddressType,
  unknownAddress?: string,
): Recipient[] => {
  const { allAccounts } = useAccountsContext();
  const { contacts } = useContactsContext();

  // TODO: add recent recipients
  const unknownRecipient =
    unknownAddress && isValidAddressForType(unknownAddress, addressType)
      ? buildRecipient('unknown', unknownAddress)
      : undefined;
  return [
    ...(unknownRecipient ? [unknownRecipient] : []),
    ...allAccounts
      .filter((acc) => getAddressByType(acc, addressType))
      .map((account) => buildRecipient('account', account)),
    ...contacts
      .filter((con) => getContactAddressByType(con, addressType))
      .map((contact) => buildRecipient('contact', contact)),
  ] as const;
};

const isValidAddressForType = (address: string, addressType: AddressType) => {
  switch (addressType) {
    case 'C':
      return isValidAddress(address);
    case 'BTC':
      return isValidBtcAddress(address);
    case 'AVM':
      return isValidAvmAddress(address);
    case 'PVM':
      return isValidPvmAddress(address);
    case 'SVM':
      return isValidSvmAddress(address);
    default:
      return false;
  }
};
