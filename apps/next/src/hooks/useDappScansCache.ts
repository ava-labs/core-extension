import { useLocalStorage } from '@core/ui';
import { omit } from 'lodash';
import { useCallback } from 'react';

const STORAGE_KEY = 'dapp-scan-cache';

export const useDappScansCache = () => {
  const { get, set } = useLocalStorage();

  const isMaliciousDapp = useCallback(
    async (dappDomain: string) => {
      const results =
        await get<Record<string, boolean | undefined>>(STORAGE_KEY);

      return Boolean(results?.[dappDomain]);
    },
    [get],
  );

  const removeMaliciousDappDomain = useCallback(
    async (dappDomain: string) => {
      const results = await get<Record<string, boolean>>(STORAGE_KEY);
      await set(STORAGE_KEY, omit(results, dappDomain));
    },
    [get, set],
  );

  const storeMaliciousDappDomain = useCallback(
    async (dappDomain: string) => {
      const results = await get<Record<string, boolean>>(STORAGE_KEY);

      await set(STORAGE_KEY, {
        ...results,
        [dappDomain]: true,
      });
    },
    [get, set],
  );
  return {
    isMaliciousDapp,
    removeMaliciousDappDomain,
    storeMaliciousDappDomain,
  };
};
