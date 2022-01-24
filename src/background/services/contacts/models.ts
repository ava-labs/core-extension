export interface Contact {
  id: string; // uuid
  name: string;
  address: string;
}

export interface ContactsState {
  contacts: Contact[];
}
