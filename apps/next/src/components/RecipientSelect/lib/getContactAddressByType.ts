import { Contact } from '@avalabs/types';
import { AddressType } from '@core/types';

export const getContactAddressByType = (
  contact: Contact,
  type: AddressType,
) => {
  switch (type) {
    case 'C':
      return contact.address;
    case 'PVM':
    case 'AVM':
      return contact.addressXP;
    case 'BTC':
      return contact.addressBTC;
    case 'SVM':
      return contact.addressSVM;
    default:
      return '';
  }
};
