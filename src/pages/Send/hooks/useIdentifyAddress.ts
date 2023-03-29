import type { Contact } from '@avalabs/types';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useCallback } from 'react';
import { isBitcoin } from '@src/utils/isBitcoin';

const UNSAVED_CONTACT_BASE = {
  id: '',
  name: 'Unsaved Address',
  isKnown: false,
};

export const useIdentifyAddress = () => {
  const { contacts } = useContactsContext();
  const { allAccounts } = useAccountsContext();
  const { network } = useNetworkContext();

  /**
   * Identifies if an address exists in the accounts or contacts
   */
  const identifyAddress = useCallback(
    (address: string): Contact => {
      if (!address)
        return { ...UNSAVED_CONTACT_BASE, address: '', addressBTC: '' };
      const addressLowerCase = address.toLowerCase();
      for (const contact of contacts) {
        if (
          contact.address.toLowerCase() === addressLowerCase ||
          contact.addressBTC?.toLocaleLowerCase() === addressLowerCase
        ) {
          const addressToUse = isBitcoin(network)
            ? { addressBTC: address, address: '' }
            : { address: address };
          return {
            id: contact.id,
            ...addressToUse,
            name: contact.name,
            isKnown: true,
          };
        }
      }
      for (const account of allAccounts) {
        if (
          account.addressC.toLowerCase() === addressLowerCase ||
          account.addressBTC.toLocaleLowerCase() === addressLowerCase
        ) {
          const addressToUse = isBitcoin(network)
            ? { addressBTC: account.addressBTC, address: '' }
            : { address: account.addressC };
          return { id: '', ...addressToUse, name: account.name, isKnown: true };
        }
      }

      return {
        ...UNSAVED_CONTACT_BASE,
        address,
        addressBTC: address,
      };
    },
    [allAccounts, contacts, network]
  );

  return identifyAddress;
};
