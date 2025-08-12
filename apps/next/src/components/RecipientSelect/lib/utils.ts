import { AddressType } from '@core/types';

import { getAddressByType } from '@/utils/getAddressByType';

import { Recipient } from '../types';
import { getContactAddressByType } from './getContactAddressByType';

export const getType = (recipient: Recipient) => {
  return recipient.type;
};

export const compareRecipients = (recipient: Recipient, other: Recipient) => {
  return recipient.id === other.id;
};

export const searchRecipients =
  (addressType: AddressType) => (recipient: Recipient, query?: string) => {
    if (!query) {
      return true;
    }

    const pureQuery = query?.toLowerCase();

    switch (recipient.type) {
      case 'account': {
        const address =
          getAddressByType(recipient.account, addressType)?.toLowerCase() ?? '';
        return (
          recipient.account.name.toLowerCase().includes(pureQuery) ||
          address.includes(pureQuery)
        );
      }
      case 'contact': {
        const address =
          getContactAddressByType(
            recipient.contact,
            addressType,
          )?.toLowerCase() ?? '';

        return (
          recipient.contact.name.toLowerCase().includes(pureQuery) ||
          address.includes(pureQuery)
        );
      }
      default:
        return recipient.address.toLowerCase().includes(pureQuery);
    }
  };
