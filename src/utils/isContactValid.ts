import type { Contact } from '@avalabs/types';
import { isAddress } from 'ethers';
import { isBech32Address } from '@avalabs/bridge-sdk';

export const isContactValid = (contact: Contact) => {
  if (!contact.name || (!contact.address && !contact.addressBTC)) {
    return { valid: false, reason: 'contact name or address is missing' };
  }

  const isAddressValid =
    (!contact.address || isAddress(contact.address)) &&
    (!contact.addressBTC || isBech32Address(contact.addressBTC));

  if (isAddressValid) {
    return { valid: true, reason: '' };
  }
  return { valid: false, reason: 'address is invalid' };
};
