import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import {
  Contact,
  ContactsEvents,
  ContactsState,
  CONTACTS_STORAGE_KEY,
} from './models';

@singleton()
export class ContactsService {
  private eventEmitter = new EventEmitter();

  constructor(private storageService: StorageService) {}

  async getContacts(): Promise<ContactsState> {
    const contacts = await this.storageService.load<ContactsState>(
      CONTACTS_STORAGE_KEY
    );

    return (
      contacts ?? {
        contacts: [],
      }
    );
  }

  async addContact(contact: Contact) {
    const contacts = await this.getContacts();

    const newContacts = {
      ...contacts,
      contacts: [...contacts.contacts, contact],
    };

    this.storageService.save(CONTACTS_STORAGE_KEY, newContacts);
    this.eventEmitter.emit(ContactsEvents.CONTACTS_UPDATED, newContacts);
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
