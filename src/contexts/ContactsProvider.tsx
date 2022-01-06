import { ExtensionRequest } from '@src/background/connections/models';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { ContactsState } from '@src/background/services/contacts/models';
import { contactsUpdatedEventListener } from '@src/background/services/contacts/events/listeners';

type ContactsFromProvider = ContactsState & {};

const ContactsContext = createContext<ContactsFromProvider>({} as any);

export function ContactsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [contacts, setContacts] = useState<ContactsState>();

  console.log('MMMM');
  console.log(contacts);

  useEffect(() => {
    if (!events) {
      return;
    }

    request({
      method: ExtensionRequest.CONTACTS_GET,
    })
      .then((res) => {
        console.log('878787');
        console.log(res);
        setContacts(res);
      })
      .catch((e) => console.log(e));

    /*const subscription = events()
    .pipe(
      filter(contactsUpdatedEventListener),
      map((evt) => evt.value)
      )
      .subscribe((val) => setContacts(val));*/

    //return () => subscription.unsubscribe();
  }, []);

  return (
    <ContactsContext.Provider
      value={
        {
          ...contacts,
        } as ContactsFromProvider
      }
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  return useContext(ContactsContext);
}
