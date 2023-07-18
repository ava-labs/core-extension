import type { Contact } from '@avalabs/types';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import xss from 'xss';
import { useIdentifyAddress } from './useIdentifyAddress';

export const useContactFromParams = () => {
  const { search } = useLocation();
  const [contact, setContact] = useState<Contact>();
  const identifyAddress = useIdentifyAddress();

  const { address } = useMemo(() => {
    const { address: rawAddress } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );
    return {
      address: xss(rawAddress),
    };
  }, [search]);

  useEffect(() => {
    setContact(address ? identifyAddress(address) : undefined);
  }, [address, identifyAddress]);

  return contact;
};
