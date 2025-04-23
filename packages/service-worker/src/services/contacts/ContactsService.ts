import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import { ContactsEvents, CONTACTS_STORAGE_KEY, ContactsState } from './models';
import type { Contact } from '@avalabs/types';
import { isContactValid } from '@core/utils';

@singleton()
export class ContactsService {
  private eventEmitter = new EventEmitter();

  constructor(private storageService: StorageService) {}

  async getContacts(): Promise<ContactsState> {
    const contacts =
      await this.storageService.load<ContactsState>(CONTACTS_STORAGE_KEY);

    return (
      contacts ?? {
        contacts: [],
      }
    );
  }

  async addContact(contact: Contact) {
    if (!isContactValid(contact).valid) {
      return;
    }

    const contacts = await this.getContacts();

    const newContacts = {
      ...contacts,
      contacts: [...contacts.contacts, contact],
    };

    this.storageService.save(CONTACTS_STORAGE_KEY, newContacts);
    this.eventEmitter.emit(ContactsEvents.CONTACTS_UPDATED, newContacts);
  }

  async updateContact(contact: Contact) {
    if (!isContactValid(contact).valid) {
      return;
    }

    const contacts = await this.getContacts();

    const updatedContacts = {
      ...contacts,
      contacts: contacts.contacts.map((c) =>
        c.id === contact.id ? contact : c,
      ),
    };

    this.storageService.save(CONTACTS_STORAGE_KEY, updatedContacts);
    this.eventEmitter.emit(ContactsEvents.CONTACTS_UPDATED, updatedContacts);
  }

  async remove(contact: Contact) {
    const contacts = await this.getContacts();

    const newContacts = {
      ...contacts,
      contacts: contacts.contacts.filter((c) => c.id !== contact.id),
    };

    this.storageService.save(CONTACTS_STORAGE_KEY, newContacts);
    this.eventEmitter.emit(ContactsEvents.CONTACTS_UPDATED, newContacts);
  }

  addListener(event: ContactsEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
