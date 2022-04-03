import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { ContactsState } from './models';

const CONTACTS_STORAGE_KEY = 'contacts';

export const saveContactsToStorage = (contacts: ContactsState) =>
  saveToStorage(CONTACTS_STORAGE_KEY, contacts);

export const getContactsFromStorage = () =>
  getFromStorage<ContactsState>(CONTACTS_STORAGE_KEY);

export function removeAllContactsFromStorage() {
  return removeFromStorage(CONTACTS_STORAGE_KEY);
}
