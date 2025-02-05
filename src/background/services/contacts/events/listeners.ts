import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { ContactsState } from '../models';
import { ContactsEvents } from '../models';

export function contactsUpdatedEventListener(
  evt: ExtensionConnectionEvent<ContactsState>,
) {
  return evt.name === ContactsEvents.CONTACTS_UPDATED;
}
