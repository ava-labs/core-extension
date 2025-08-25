import { AddressType } from '@core/types';

import { getAddressByType } from '@/utils/getAddressByType';

import { Recipient } from '../types';
import { getContactAddressByType } from './getContactAddressByType';

export const getRecipientAddressByType = (
  recipient: Recipient,
  addressType: AddressType,
) => {
  switch (recipient.type) {
    case 'account':
      return getAddressByType(recipient.account, addressType);
    case 'contact':
      return getContactAddressByType(recipient.contact, addressType);
    default:
      return recipient.address;
  }
};
