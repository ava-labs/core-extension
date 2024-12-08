import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import xss from 'xss';

export const useAppTypeFromParams = (): LedgerAppType => {
  const { search } = useLocation();

  return useMemo(() => {
    const { app } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries(),
    );
    return xss(app) as LedgerAppType;
  }, [search]);
};
