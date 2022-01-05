import React, { createContext, useContext, useState } from 'react';

type ContactsProvider = {
  contacts: any;
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
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF67',
    },
    {
      name: 'Julia',
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF67',
    },
  ]);

  return (
    <ContactsContext.Provider value={{ contacts }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  return useContext(ContactsContext);
}
