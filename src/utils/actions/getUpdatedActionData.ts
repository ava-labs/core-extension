import type { SigningData } from '@avalabs/vm-module-types';

export const getUpdatedSigningData = (
  oldSigningData?: SigningData,
  newSigningData?: SigningData,
): SigningData | undefined => {
  if (!oldSigningData) {
    return newSigningData;
  } else if (!newSigningData) {
    return oldSigningData;
  }

  return {
    ...oldSigningData,
    ...newSigningData,
  };
};
