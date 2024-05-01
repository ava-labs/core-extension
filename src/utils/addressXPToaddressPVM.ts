import { Contact } from '@avalabs/types';

const PVM_PREFIX = 'P-';

export function addressXpToAddressPvm(contact?: Contact) {
  if (!contact || !contact.addressXP) {
    return '';
  }
  if (contact.addressXP.startsWith(PVM_PREFIX)) {
    return contact.addressXP;
  }
  return `${PVM_PREFIX}${contact.addressXP}`;
}
