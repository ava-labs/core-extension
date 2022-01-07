import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { ContactsState } from './models';

const CONTACTS_STORAGE_KEY = 'contacts';

export const saveContactsToStorage = (contacts: ContactsState) =>
  saveToStorage({ [CONTACTS_STORAGE_KEY]: contacts });

export const getContactsFromStorage = () =>
  getFromStorage<{ contacts: ContactsState }>(CONTACTS_STORAGE_KEY).then(
    (storage) => storage.contacts
  );

export function removeAllContactsFromStorage() {
  return removeFromStorage(CONTACTS_STORAGE_KEY);
}
