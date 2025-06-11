import { CustomRpcHeaders } from '@core/types';

export const buildGlacierAuthHeaders = (apiKey: string): CustomRpcHeaders => {
  if (!apiKey) {
    return {};
  }

  return {
    'X-Glacier-Api-Key': apiKey,
  };
};
