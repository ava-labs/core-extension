import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export type Contact = {
  name: string;
  address: string;
};

type ContactsProvider = {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  deleteContact: (contactAddress: string) => void;
  editedContact: Contact;
  setEditedContact: Dispatch<SetStateAction<Contact>>;
  updateContact: () => void;
  addContact: (contact: Contact) => void;
};

const ContactsContext = createContext<ContactsProvider>({} as any);

export function ContactsContextProvider({ children }) {
  const [editedContact, setEditedContact] = useState<Contact>({
    name: '',
    address: '',
  });
  const [contacts, setContacts] = useState<Contact[]>([
    {
      name: 'Mike',
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF67',
    },
    {
      name: 'Todd',
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF68',
    },
    {
      name: 'Julia',
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF69',
    },
  ]);

  function addContact(contact): void {
    setContacts([...contacts, contact]);
  }

  function updateContact(): void {
    const contactsCopy = [...contacts];
    const contactToUpdateIndex = contacts.findIndex(
      ({ address }) => address === editedContact.address
    );
    contactsCopy[contactToUpdateIndex] = editedContact; // replacing the edited contact

    setContacts(contactsCopy);
  }

  function deleteContact(contactAddress: string): void {
    const contactsUpdated = contacts.filter(
      ({ address }) => address !== contactAddress
    );
    setContacts(contactsUpdated);
  }

  return (
    <ContactsContext.Provider
      value={{
        addContact,
        contacts,
        setContacts,
        deleteContact,
        editedContact,
        setEditedContact,
        updateContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  return useContext(ContactsContext);
}
