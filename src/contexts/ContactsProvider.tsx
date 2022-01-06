import { ExtensionRequest } from '@src/background/connections/models';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import {
  Contact,
  ContactsState,
} from '@src/background/services/contacts/models';
import { contactsUpdatedEventListener } from '@src/background/services/contacts/events/listeners';
import { getContacts } from '@src/background/services/contacts/handlers/getContacts';

type ContactsFromProvider = ContactsState & {
  createContact(contact: Contact): Promise<any>;
  removeContact(contact: Contact): Promise<any>;
};

const ContactsContext = createContext<ContactsFromProvider>({} as any);

export function ContactsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [contacts, setContacts] = useState<ContactsState>();

  function getContacts() {
    return request({
      method: ExtensionRequest.CONTACTS_GET,
    }).then((res) => {
      setContacts(res);
      return res;
    });
  }

  useEffect(() => {
    if (!events) {
      return;
    }

    getContacts();

    const subscription = events()
      .pipe(
        filter(contactsUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((val) => setContacts(val));

    return () => subscription.unsubscribe();
  }, []);

  async function createContact(contact: Contact) {
    console.log('CREATING...');
    await request({
      method: ExtensionRequest.CONTACTS_CREATE,
      params: [contact],
    });
    return getContacts();
  }

  async function removeContact(contact: Contact) {
    await request({
      method: ExtensionRequest.CONTACTS_REMOVE,
      params: [contact],
    });
    return getContacts();
  }

  return (
    <ContactsContext.Provider
      value={
        {
          ...contacts,
          createContact,
          removeContact,
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
