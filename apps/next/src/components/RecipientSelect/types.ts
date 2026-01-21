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

export type Recipient =
  | AccountRecipient
  | ContactRecipient
  | RecentRecipient
  | UnknownRecipient;
