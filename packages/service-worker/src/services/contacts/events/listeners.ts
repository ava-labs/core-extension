import { ExtensionConnectionEvent } from '../../../connections/models';
import { ContactsState, ContactsEvents } from '@core/types/src/models';

export function contactsUpdatedEventListener(
  evt: ExtensionConnectionEvent<ContactsState>,
) {
  return evt.name === ContactsEvents.CONTACTS_UPDATED;
}
