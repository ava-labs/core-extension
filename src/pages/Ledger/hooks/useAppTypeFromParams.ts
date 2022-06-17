import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useAppTypeFromParams = (): LedgerAppType => {
  const { search } = useLocation();

  const { app } = useMemo(
    () =>
      (Object as any).fromEntries(
        (new URLSearchParams(search) as any).entries()
      ),
    [search]
  );

  return app;
};
