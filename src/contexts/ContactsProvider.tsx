import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type ContactsProvider = {
  contacts: any;
  setContacts: Dispatch<SetStateAction<any>>;
  deleteContact: (contactAddress: string) => void;
};

const ContactsContext = createContext<ContactsProvider>({} as any);

export function ContactsContextProvider({ children }) {
  const [contacts, setContacts] = useState<any>([
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

  function deleteContact(contactAddress: string): void {
    const contactsUpdated = contacts.filter(
      ({ address }) => address !== contactAddress
    );
    setContacts(contactsUpdated);
  }

  return (
    <ContactsContext.Provider value={{ contacts, setContacts, deleteContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  return useContext(ContactsContext);
}
