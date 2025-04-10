import { ExtensionConnectionEvent } from '../../../connections/models';
import { ContactsState, ContactsEvents } from '../models';

export function contactsUpdatedEventListener(
  evt: ExtensionConnectionEvent<ContactsState>,
) {
  return evt.name === ContactsEvents.CONTACTS_UPDATED;
}
