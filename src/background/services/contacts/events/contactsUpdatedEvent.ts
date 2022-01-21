import { filter, map, OperatorFunction } from 'rxjs';
import { ContactsState } from '../models';
import { contacts$ } from '../contacts';
import { ContactsEvents } from './models';

export function contactsUpdatedEvent() {
  return contacts$.pipe(
    filter((value) => value !== undefined) as OperatorFunction<
      ContactsState | undefined,
      ContactsState
    >,
    map((value) => ({
      name: ContactsEvents.CONTACTS_UPDATED,
      value,
    }))
  );
}
