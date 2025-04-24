import {
  ContactsState,
  ContactsEvents,
  ExtensionConnectionEvent,
} from '@core/types';

export function contactsUpdatedEventListener(
  evt: ExtensionConnectionEvent<ContactsState>,
) {
  return evt.name === ContactsEvents.CONTACTS_UPDATED;
}
