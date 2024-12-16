import { ContactsEvents } from '../models';
import {
  ExtensionConnectionEvent,
  ExtensionEventEmitter,
} from '@src/background/connections/models';
import { ContactsService } from '../ContactsService';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

@singleton()
export class ContactsUpdatedEvents implements ExtensionEventEmitter {
  private eventEmitter = new EventEmitter();
  constructor(private contactsService: ContactsService) {
    this.contactsService.addListener(
      ContactsEvents.CONTACTS_UPDATED,
      (contacts) => {
        this.eventEmitter.emit('update', {
          name: ContactsEvents.CONTACTS_UPDATED,
          value: contacts,
        });
      },
    );
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.eventEmitter.on('update', handler);
  }

  removeListener(
    handler: (event: ExtensionConnectionEvent<any>) => void,
  ): void {
    this.eventEmitter.off('update', handler);
  }
}
