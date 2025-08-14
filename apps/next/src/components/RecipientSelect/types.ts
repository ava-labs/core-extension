import { Contact } from '@avalabs/types';

import { Account } from '@core/types';

export type RecipientType = 'account' | 'contact' | 'recent' | 'unknown';

export type RecipientBase = {
  id: string;
};

export type RecentRecipient = {
  type: 'recent';
  address: string;
} & RecipientBase;

export type AccountRecipient = {
  type: 'account';
  account: Account;
} & RecipientBase;

export type ContactRecipient = {
  type: 'contact';
  contact: Contact;
} & RecipientBase;

export type UnknownRecipient = {
  type: 'unknown';
  address: string;
} & RecipientBase;

export const isAccountRecipient = (
  recipient: Recipient,
): recipient is AccountRecipient => recipient.type === 'account';

export const isContactRecipient = (
  recipient: Recipient,
): recipient is ContactRecipient => recipient.type === 'contact';

export const isRecentRecipient = (
  recipient: Recipient,
): recipient is RecentRecipient => recipient.type === 'recent';

export const isUnknownRecipient = (
  recipient: Recipient,
): recipient is UnknownRecipient => recipient.type === 'unknown';

export type Recipient =
  | AccountRecipient
  | ContactRecipient
  | RecentRecipient
  | UnknownRecipient;
