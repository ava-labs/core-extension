import { Account } from '@core/types';
import { Contact } from '@avalabs/types';

import {
  AccountRecipient,
  ContactRecipient,
  RecentRecipient,
  Recipient,
  RecipientType,
  UnknownRecipient,
} from '../types';

export function buildRecipient(
  type: 'account',
  payload: Account,
): AccountRecipient;
export function buildRecipient(
  type: 'contact',
  payload: Contact,
): ContactRecipient;
export function buildRecipient(
  type: 'recent',
  payload: string,
): RecentRecipient;
export function buildRecipient(
  type: 'unknown',
  payload: string,
): UnknownRecipient;
export function buildRecipient(
  type: RecipientType,
  payload: Account | Contact | string,
): Recipient {
  switch (type) {
    case 'account':
      return buildAccountRecipient(payload as Account);
    case 'contact':
      return buildContactRecipient(payload as Contact);
    case 'recent':
      return buildRecentRecipient(payload as string);
    default:
      return buildUnknownRecipient(payload as string);
  }
}

function buildAccountRecipient(account: Account): AccountRecipient {
  return {
    type: 'account',
    id: `account:${account.id}`,
    account,
  };
}
function buildContactRecipient(contact: Contact): ContactRecipient {
  return {
    type: 'contact',
    id: `contact:${contact.id}`,
    contact,
  };
}
function buildRecentRecipient(address: string): RecentRecipient {
  return {
    type: 'recent',
    id: `recent:${address}`,
    address,
  };
}
function buildUnknownRecipient(address: string): UnknownRecipient {
  return {
    type: 'unknown',
    id: `unknown:${address}`,
    address,
  };
}
