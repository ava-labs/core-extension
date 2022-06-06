export interface Contact {
  id: string; // uuid
  name: string;
  address: string;
  isKnown?: boolean;
  addressBTC?: string;
}

export interface ContactsState {
  contacts: Contact[];
}

export enum ContactsEvents {
  CONTACTS_UPDATED = 'ContactsEvents: CONTACTS_UPDATED',
}

export const CONTACTS_STORAGE_KEY = 'contacts';
