import { Environment } from '@avalabs/unified-asset-transfer';

export const getEnvironment = (
  isDeveloperMode: boolean | undefined,
  isDevEnv: boolean,
) => {
  if (typeof isDeveloperMode !== 'boolean') {
    return null;
  }

  if (isDevEnv) {
    return Environment.DEV;
  }

  return isDeveloperMode ? Environment.TEST : Environment.PROD;
};
