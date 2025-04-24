import type { Contact } from '@avalabs/types';

export interface ContactsState {
  contacts: Contact[];
}

export enum ContactsEvents {
  CONTACTS_UPDATED = 'ContactsEvents: CONTACTS_UPDATED',
}

export const CONTACTS_STORAGE_KEY = 'contacts';
