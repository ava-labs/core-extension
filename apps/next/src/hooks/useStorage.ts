import { isFunction } from 'lodash-es';
import { useEffect, useState } from 'react';

/**
 * A utility function to get the storage object based on the type of storage.
 *
 * @param storage `'local'` or `'session'`
 * @returns the storage object or a dummy object if the storage is not available
 */
export const getStorage = (storage: 'local' | 'session'): Storage => {
  if (storage === 'local' && typeof globalThis.localStorage !== 'undefined') {
    return globalThis.localStorage;
  }

  if (
    storage === 'session' &&
    typeof globalThis.sessionStorage !== 'undefined'
  ) {
    return globalThis.sessionStorage;
  }

  return {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
    key: () => null,
    length: 0,
  };
};

/**
 * A wrapper for "JSON.parse()"" to support "undefined" value
 */
export const parseJSON = <T>(value?: string | null): T | undefined => {
  try {
    return value === 'undefined' ? undefined : (JSON.parse(value ?? '') as T);
  } catch {
    return undefined;
  }
};

type StorageType = 'local' | 'session';

/**
 * Options for the useStorage hook
 */
interface UseStorageOptions {
  storageType?: StorageType;
}

const storageEventTarget = new EventTarget();

/**
 * A hook for managing state that is persisted in localStorage or sessionStorage
 * with proper error handling and cross-tab synchronization.
 *
 * @param key The key to use for storage (should be from a strongly typed enum or string literal union)
 * @param initialValue The initial value if nothing exists in storage
 * @param options Additional options for the hook
 * @returns A stateful value and a function to update it
 */
export const useStorage = <TKey extends string, TValue>(
  key: TKey,
  initialValue: TValue,
  options: UseStorageOptions = {},
): [TValue, (value: TValue | ((val: TValue) => TValue)) => void] => {
  const { storageType = 'local' } = options;
  const storage = getStorage(storageType);

  // Read initial value from storage
  const readValue = () => {
    try {
      const item = storage.getItem(key);
      return parseJSON<TValue>(item) ?? initialValue;
    } catch (error) {
      console.error(
        `Error reading from ${storageType} storage key "${key}":`,
        error,
      );
      return initialValue;
    }
  };

  // State is always synced with storage
  const [state, setState] = useState<TValue>(readValue);

  // Update both storage and state
  const setValue = (value: TValue | ((val: TValue) => TValue)): void => {
    try {
      const valueToStore = isFunction(value)
        ? (value as (val: TValue) => TValue)(state)
        : value;

      setState(valueToStore);

      if (valueToStore === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(valueToStore));
      }

      // Broadcast to other hook instances in the same tab
      storageEventTarget.dispatchEvent(
        new CustomEvent(key, { detail: valueToStore }),
      );
    } catch (error) {
      console.error(`Error writing to ${storageType} storage:`, error);
    }
  };

  // Listen for storage events from other tabs and custom events in the same tab
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === key &&
        e.storageArea ===
          (storageType === 'local' ? localStorage : sessionStorage)
      ) {
        try {
          const newValue = parseJSON<TValue>(e.newValue) ?? initialValue;
          setState(newValue);
        } catch (error) {
          console.error('Error handling storage event:', error);
        }
      }
    };

    const handleCustomStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setState(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    storageEventTarget.addEventListener(key, handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      storageEventTarget.removeEventListener(key, handleCustomStorageChange);
    };
  }, [key, initialValue, storageType]);

  return [state, setValue];
};
