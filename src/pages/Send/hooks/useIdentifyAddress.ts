import { Contact } from '@src/background/services/contacts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useCallback } from 'react';

export const useIdentifyAddress = () => {
  const { contacts } = useContactsContext();
  const { accounts } = useAccountsContext();

  /**
   * Identifies if an address exists in the accounts or contacts
   */
  const identifyAddress = useCallback(
    (address: string): Contact => {
      const addressLowerCase = address.toLowerCase();
      for (const contact of contacts) {
        if (contact.address.toLowerCase() === addressLowerCase) {
          return { id: contact.id, address, name: contact.name, isKnown: true };
        }
      }
      for (const account of accounts) {
        if (account.addressC.toLowerCase() === addressLowerCase)
          return { id: '', address, name: account.name, isKnown: true };
      }
      return {
        id: '',
        address,
        name: 'Unsaved Address',
        isKnown: false,
      };
    },
    [accounts, contacts]
  );

  return identifyAddress;
};
