import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useContactsContext } from '@/contexts/ContactsProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import type { Contact } from '@avalabs/types';
import {
  isBitcoin,
  isPchainNetwork,
  isSolanaNetwork,
  isXchainNetwork,
} from '@core/utils';
import { useCallback } from 'react';
import { correctAddressByPrefix } from '../utils/correctAddressByPrefix';

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
        return {
          ...UNSAVED_CONTACT_BASE,
          address: '',
          addressBTC: '',
          addressXP: '',
          addressSVM: '',
        };
      const addressLowerCase = address.toLowerCase();
      for (const contact of contacts) {
        if (
          contact.address.toLowerCase() === addressLowerCase ||
          contact.addressBTC?.toLowerCase() === addressLowerCase ||
          `p-${contact.addressXP?.toLowerCase()}` ===
            correctAddressByPrefix(addressLowerCase, 'p-') ||
          `x-${contact.addressXP?.toLowerCase()}` ===
            correctAddressByPrefix(addressLowerCase, 'x-')
        ) {
          const addressToUse = isBitcoin(network)
            ? { addressBTC: address, address: '', addressPVM: '' }
            : isPchainNetwork(network) || isXchainNetwork(network)
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
          account.addressPVM?.toLocaleLowerCase() ===
            correctAddressByPrefix(addressLowerCase, 'p-') ||
          account.addressAVM?.toLowerCase() ===
            correctAddressByPrefix(addressLowerCase, 'x-') ||
          account.addressSVM?.toLowerCase() === addressLowerCase
        ) {
          const addressToUse =
            network && isSolanaNetwork(network)
              ? { addressSVM: account.addressSVM, address: '' }
              : isBitcoin(network)
                ? { addressBTC: account.addressBTC, address: '' }
                : isPchainNetwork(network)
                  ? {
                      addressXP: address,
                      address: '',
                      addressBTC: '',
                    }
                  : isXchainNetwork(network)
                    ? {
                        addressXP: address,
                        address: '',
                        addressBTC: '',
                      }
                    : { address: account.addressC };
          return { id: '', ...addressToUse, name: account.name, isKnown: true };
        }
      }

      return isSolanaNetwork(network)
        ? {
            ...UNSAVED_CONTACT_BASE,
            address: '',
            addressXP: '',
            addressBTC: '',
            addressSVM: address,
          }
        : isBitcoin(network)
          ? {
              ...UNSAVED_CONTACT_BASE,
              address: '',
              addressBTC: address,
              addressXP: '',
            }
          : isPchainNetwork(network) || isXchainNetwork(network)
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
    [allAccounts, contacts, network],
  );

  return identifyAddress;
};
