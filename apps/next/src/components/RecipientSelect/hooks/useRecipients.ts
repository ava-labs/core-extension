import { useMemo } from 'react';
import { AddressType } from '@core/types';
import {
  isBtcAddressInNetwork,
  isValidAddress,
  isValidPvmAddress,
  isValidAvmAddress,
  isValidBtcAddress,
  isValidSvmAddress,
} from '@core/common';
import {
  useAccountsContext,
  useContactsContext,
  useNetworkContext,
} from '@core/ui';

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
  const { isDeveloperMode } = useNetworkContext();

  const accountRecipients = useMemo(
    () =>
      allAccounts
        .filter((acc) => getAddressByType(acc, addressType))
        .map((account) => buildRecipient('account', account)),
    [allAccounts, addressType],
  );

  const contactRecipients = useMemo(
    () =>
      contacts
        .filter((con) => getContactAddressByType(con, addressType))
        .map((contact) => buildRecipient('contact', contact)),
    [contacts, addressType],
  );

  // Check if unknownAddress already exists in accounts or contacts
  const addressExistsInRecipients = useMemo(() => {
    if (!unknownAddress) return false;

    const normalizedUnknown = unknownAddress.toLowerCase();
    const matches = (address?: string) =>
      address?.toLowerCase().includes(normalizedUnknown) ?? false;

    // Check if it matches any account address
    const existsInAccounts = allAccounts.some((account) =>
      matches(getAddressByType(account, addressType)),
    );

    if (existsInAccounts) return true;

    // Check if it matches any contact address
    const existsInContacts = contacts.some((contact) =>
      matches(getContactAddressByType(contact, addressType)),
    );

    return existsInContacts;
  }, [unknownAddress, allAccounts, contacts, addressType]);

  // TODO: add recent recipients
  // Only include unknown recipient if address is valid and doesn't exist in accounts/contacts
  const unknownRecipient =
    unknownAddress &&
    isValidAddressForType(unknownAddress, addressType, isDeveloperMode) &&
    !addressExistsInRecipients
      ? buildRecipient('unknown', unknownAddress)
      : undefined;

  return [
    ...(unknownRecipient ? [unknownRecipient] : []),
    ...accountRecipients,
    ...contactRecipients,
  ] as const;
};

const isValidAddressForType = (
  address: string,
  addressType: AddressType,
  // BTC and X/P addresses must be validated against the active network
  isTestnet: boolean,
) => {
  switch (addressType) {
    case 'C':
      return isValidAddress(address);
    case 'BTC':
      return (
        isValidBtcAddress(address) && isBtcAddressInNetwork(address, !isTestnet)
      );
    case 'AVM':
      return isValidAvmAddress(address, isTestnet);
    case 'PVM':
      return isValidPvmAddress(address, isTestnet);
    case 'SVM':
      return isValidSvmAddress(address);
    default:
      return false;
  }
};
