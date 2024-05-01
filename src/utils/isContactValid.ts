import type { Contact } from '@avalabs/types';
import { isAddress } from 'ethers';
import { isBech32Address } from '@avalabs/bridge-sdk';
import { isValidXPAddress } from './isAddressValid';

export const isContactValid = (contact: Contact) => {
  if (
    !contact.name ||
    (!contact.address && !contact.addressBTC && !contact.addressXP)
  ) {
    return { valid: false, reason: 'contact name or address is missing' };
  }

  const isAddressValid =
    (!contact.address || isAddress(contact.address)) &&
    (!contact.addressBTC || isBech32Address(contact.addressBTC)) &&
    (!contact.addressXP || isValidXPAddress(contact.addressXP));

  if (isAddressValid) {
    return { valid: true, reason: '' };
  }
  return { valid: false, reason: 'address is invalid' };
};
