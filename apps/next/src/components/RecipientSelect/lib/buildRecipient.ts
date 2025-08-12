import { Account } from '@core/types';
import { Contact } from '@avalabs/types';

import {
  AccountRecipient,
  ContactRecipient,
  RecentRecipient,
  UnknownRecipient,
} from '../types';

export function buildAccountRecipient(account: Account): AccountRecipient {
  return {
    type: 'account',
    id: `account:${account.id}`,
    account,
  };
}
export function buildContactRecipient(contact: Contact): ContactRecipient {
  return {
    type: 'contact',
    id: `contact:${contact.id}`,
    contact,
  };
}
export function buildRecentRecipient(address: string): RecentRecipient {
  return {
    type: 'recent',
    id: `recent:${address}`,
    address,
  };
}
export function buildUnknownRecipient(address: string): UnknownRecipient {
  return {
    type: 'unknown',
    id: `unknown:${address}`,
    address,
  };
}
