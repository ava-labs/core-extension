import { storage } from 'webextension-polyfill';

export const useLocalStorage = () => {
  return {
    async get(key: string) {
      const stored = await storage.local.get(key);

      return stored[key];
    },
    async set(key: string, value: any) {
      return storage.local.set({ [key]: value });
    },
  };
};
