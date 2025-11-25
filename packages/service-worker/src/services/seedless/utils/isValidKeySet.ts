import { KeySet } from '../types';
import { REQUIRED_KEY_TYPES, SUPPORTED_KEY_TYPES } from './constants';

// Verifies that the key set only contains the supported key types
// and that it cointains all the required key types.
export const isValidKeySet = (keySet: KeySet) => {
  return (
    keySet.every((entry) => SUPPORTED_KEY_TYPES.includes(entry.type)) &&
    REQUIRED_KEY_TYPES.every((type) =>
      keySet.some((entry) => type === entry.type),
    )
  );
};
