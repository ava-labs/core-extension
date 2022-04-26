import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useTabFromParams = () => {
  const { search } = useLocation();

  return useMemo(() => {
    const { activeTab } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    return {
      activeTab,
    };
  }, [search]);
};
