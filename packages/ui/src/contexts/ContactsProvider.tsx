import { ExtensionRequest } from '@core/service-worker';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { ContactsState } from '@core/service-worker';
import type { Contact } from '@avalabs/types';
import { contactsUpdatedEventListener } from '@core/service-worker';
import { GetContactsHandler } from '@core/service-worker';
import { CreateContactHandler } from '@core/service-worker';
import { UpdateContactHandler } from '@core/service-worker';
import { RemoveContactHandler } from '@core/service-worker';

type ContactsFromProvider = ContactsState & {
  createContact(contact: Contact): Promise<any>;
  removeContact(contact: Contact): Promise<any>;
  updateContact(contact: Contact): Promise<any>;
  getContactById(contactId: string): Contact | undefined;
  getContactByAddress(address: string): Contact | undefined;
};

const ContactsContext = createContext<ContactsFromProvider>({} as any);

export function ContactsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [contacts, setContacts] = useState<ContactsState>({
    contacts: [],
  });

  useEffect(() => {
    let isMounted = true;
    request<GetContactsHandler>({ method: ExtensionRequest.CONTACTS_GET }).then(
      (res) => {
        if (!isMounted) {
          return;
        }
        setContacts(res);
      },
    );

    const subscription = events()
      .pipe(
        filter(contactsUpdatedEventListener),
        map((evt) => evt.value),
      )
      .subscribe((val) => setContacts(val));

    return () => {
      subscription.unsubscribe();
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContactById = (contactId: string) => {
    return contacts.contacts.filter((c) => c.id === contactId)[0];
  };

  async function createContact(contact: Contact) {
    const contactCopy = {
      ...contact,
      id: crypto.randomUUID(),
    };
    await request<CreateContactHandler>({
      method: ExtensionRequest.CONTACTS_CREATE,
      params: [contactCopy],
    });
  }

  async function updateContact(contact: Contact) {
    await request<UpdateContactHandler>({
      method: ExtensionRequest.CONTACTS_UPDATE,
      params: [contact],
    });
  }

  async function removeContact(contact: Contact) {
    await request<RemoveContactHandler>({
      method: ExtensionRequest.CONTACTS_REMOVE,
      params: [contact],
    });
  }

  const getContactByAddress = useCallback(
    (lookupAddress: string) =>
      contacts.contacts.find(({ address, addressBTC, addressXP }) =>
        [address, addressBTC, addressXP]
          .map((a) => (a ?? '').toLowerCase())
          .includes(lookupAddress),
      ),
    [contacts.contacts],
  );

  return (
    <ContactsContext.Provider
      value={{
        ...contacts,
        createContact,
        removeContact,
        updateContact,
        getContactById,
        getContactByAddress,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  return useContext(ContactsContext);
}
