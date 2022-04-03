import { BehaviorSubject, filter, switchMap } from 'rxjs';
import { storageKey$ } from '../wallet/storageKey';
import { ContactsState } from './models';
import { getContactsFromStorage } from './storage';

export const defaultContactsState: ContactsState = {
  contacts: [],
};

export const contacts$ = new BehaviorSubject<ContactsState>(
  defaultContactsState
);

storageKey$
  .pipe(
    filter((ready) => !!ready),
    switchMap(() => getContactsFromStorage())
  )
  .subscribe((res) => {
    return res && contacts$.next(res);
  });
