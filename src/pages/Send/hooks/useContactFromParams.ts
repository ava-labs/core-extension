import { Contact } from '@src/background/services/contacts/models';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdentifyAddress } from './useIdentifyAddress';

export const useContactFromParams = () => {
  const { search } = useLocation();
  const [contact, setContact] = useState<Contact>();
  const identifyAddress = useIdentifyAddress();

  const { address } = useMemo(
    () =>
      (Object as any).fromEntries(
        (new URLSearchParams(search) as any).entries()
      ),
    [search]
  );

  useEffect(() => {
    setContact(address ? identifyAddress(address) : undefined);
  }, [address, identifyAddress]);

  return contact;
};
