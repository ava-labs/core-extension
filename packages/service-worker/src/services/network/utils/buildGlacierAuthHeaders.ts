import { CustomRpcHeaders } from '@core/types/src/models';

export const buildGlacierAuthHeaders = (apiKey: string): CustomRpcHeaders => {
  if (!apiKey) {
    return {};
  }

  return {
    'X-Glacier-Api-Key': apiKey,
  };
};
