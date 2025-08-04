import { storage } from 'webextension-polyfill';

const STORAGE_WRAPPER = Object.freeze({
  async get<T>(key: string): Promise<T | undefined> {
    const stored = await storage.local.get(key);

    return stored[key];
  },
  async set(key: string, value: any) {
    return storage.local.set({ [key]: value });
  },
} as const);

// TODO: Since it's clearly not a hook, we should rename it to getLocalStorage.
// Meanwhile, the storage wrapper is moved outside the hook to prevent
// unnecessary useMemo/useCallback re-validation.
export const useLocalStorage = () => STORAGE_WRAPPER;
