import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import xss from 'xss';

export const useContactIdFromParams = () => {
  const { search } = useLocation();

  return useMemo(() => {
    const { contactId } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    return {
      contactId: xss(contactId),
    };
  }, [search]);
};
