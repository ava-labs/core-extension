import {
  ContactsState,
  ContactsEvents,
  ExtensionConnectionEvent,
} from '@core/types';

export function contactsUpdatedEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<ContactsState> {
  return evt.name === ContactsEvents.CONTACTS_UPDATED;
}
