import type { Contact } from '@avalabs/types';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useCallback } from 'react';
import { isBitcoin } from '@src/utils/isBitcoin';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';

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
          contact.addressBTC?.toLowerCase() === addressLowerCase ||
          `p-${contact.addressXP?.toLowerCase()}` === addressLowerCase
        ) {
          const addressToUse = isBitcoin(network)
            ? { addressBTC: address, address: '', addressPVM: '' }
            : isPchainNetwork(network)
            ? { addressXP: address, address: '', addressBTC: '' }
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
          account.addressBTC?.toLocaleLowerCase() === addressLowerCase ||
          account.addressPVM?.toLocaleLowerCase() === addressLowerCase
        ) {
          const addressToUse = isBitcoin(network)
            ? { addressBTC: account.addressBTC, address: '' }
            : isPchainNetwork(network)
            ? {
                addressXP: account.addressPVM ? account.addressPVM : '',
                address: '',
                addressBTC: '',
              }
            : { address: account.addressC };
          return { id: '', ...addressToUse, name: account.name, isKnown: true };
        }
      }

      return isBitcoin(network)
        ? {
            ...UNSAVED_CONTACT_BASE,
            address: '',
            addressBTC: address,
            addressXP: '',
          }
        : isPchainNetwork(network)
        ? {
            ...UNSAVED_CONTACT_BASE,
            address: '',
            addressBTC: '',
            addressXP: address,
          }
        : {
            ...UNSAVED_CONTACT_BASE,
            address,
            addressBTC: '',
            addressXP: '',
          };
    },
    [allAccounts, contacts, network]
  );

  return identifyAddress;
};
