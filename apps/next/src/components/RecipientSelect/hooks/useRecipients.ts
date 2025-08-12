import { useAccountsContext, useContactsContext } from '@core/ui';
import { Recipient } from '../types';
import {
  buildAccountRecipient,
  buildContactRecipient,
  buildUnknownRecipient,
} from '../lib/buildRecipient';
import { AddressType } from '@core/types';
import { getAddressByType } from '@/utils/getAddressByType';
import { getContactAddressByType } from '../lib/getContactAddressByType';
import {
  isValidAddress,
  isValidPvmAddress,
  isValidAvmAddress,
  isValidBtcAddress,
  isValidSvmAddress,
} from '@core/common';

export const useRecipients = (
  addressType: AddressType,
  unknownAddress?: string,
): Recipient[] => {
  const { allAccounts } = useAccountsContext();
  const { contacts } = useContactsContext();

  // TODO: add recent recipients
  const unknownRecipient =
    unknownAddress && isValidAddressForType(unknownAddress, addressType)
      ? buildUnknownRecipient(unknownAddress)
      : undefined;
  return [
    ...(unknownRecipient ? [unknownRecipient] : []),
    ...allAccounts
      .filter((acc) => getAddressByType(acc, addressType))
      .map((account) => buildAccountRecipient(account)),
    ...contacts
      .filter((con) => getContactAddressByType(con, addressType))
      .map((contact) => buildContactRecipient(contact)),
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
