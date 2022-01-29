export interface Contact {
  id: string; // uuid
  name: string;
  address: string;
  isKnown?: boolean;
}

export interface ContactsState {
  contacts: Contact[];
}
