import { BehaviorSubject } from 'rxjs';
import { ContactsState } from './models';
import { getContactsFromStorage } from './storage';

export const defaultContactsState: ContactsState = {
  contacts: [
    {
      name: 'julia',
      address: '123456789',
    },
  ],
};

export const contacts$ = new BehaviorSubject<ContactsState>(
  defaultContactsState
);

getContactsFromStorage().then((res) => {
  return res && contacts$.next(res);
});
