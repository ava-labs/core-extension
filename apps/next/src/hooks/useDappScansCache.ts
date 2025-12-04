import { useLocalStorage } from '@core/ui';
import { useCallback } from 'react';

const STORAGE_KEY = 'dapp-scan-cache';

export const useDappScansCache = () => {
  const { get, set } = useLocalStorage();

  const getResult = useCallback(
    async (dAppURL: string) => {
      const results =
        await get<Record<string, { isMalicious: boolean }>>(STORAGE_KEY);

      return results?.[dAppURL];
    },
    [get],
  );

  const setResult = useCallback(
    async (dAppURL: string, isMalicious: boolean) => {
      const results = await get<Record<string, boolean>>(STORAGE_KEY);

      await set(STORAGE_KEY, {
        ...results,
        [dAppURL]: isMalicious,
      });
    },
    [get, set],
  );
  return {
    setResult,
    getResult,
  };
};
