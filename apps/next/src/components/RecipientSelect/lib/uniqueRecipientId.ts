import { Recipient } from '../types';

export const getUniqueRecipientId = (recipient: Recipient) => {
  switch (recipient.type) {
    case 'account':
      return `account:${recipient.account.id}`;
    case 'contact':
      return `contact:${recipient.contact.id}`;
    case 'recent':
      return `recent:${recipient.address}`;
    case 'unknown':
      return `unknown:${recipient.address}`;
  }
};
