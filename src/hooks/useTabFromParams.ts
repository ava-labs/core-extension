import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import xss from 'xss';

export const useTabFromParams = () => {
  const { search } = useLocation();

  return useMemo(() => {
    const { activeTab } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries(),
    );

    return {
      activeTab: xss(activeTab),
    };
  }, [search]);
};
