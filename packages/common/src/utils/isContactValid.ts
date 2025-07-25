import type { Contact } from '@avalabs/types';
import { isAddress } from 'ethers';
import { isBech32Address } from '@avalabs/core-bridge-sdk';
import { isValidSvmAddress, isValidXPAddress } from './isAddressValid';
import { PartialBy } from '@core/types';

export const isContactValid = (contact: PartialBy<Contact, 'id'>) => {
  if (
    !contact.name ||
    (!contact.address &&
      !contact.addressBTC &&
      !contact.addressXP &&
      !contact.addressSVM)
  ) {
    return { valid: false, reason: 'contact name or address is missing' };
  }

  const isAddressValid =
    (!contact.address || isAddress(contact.address)) &&
    (!contact.addressBTC || isBech32Address(contact.addressBTC)) &&
    (!contact.addressXP || isValidXPAddress(contact.addressXP)) &&
    (!contact.addressSVM || isValidSvmAddress(contact.addressSVM));

  if (isAddressValid) {
    return { valid: true, reason: '' };
  }
  return { valid: false, reason: 'address is invalid' };
};
