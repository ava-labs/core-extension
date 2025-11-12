import { Environment } from '@avalabs/bridge-unified';

export const getEnvironment = (
  isTestnet: boolean | undefined,
  isDevEnv: boolean,
) => {
  if (typeof isTestnet !== 'boolean') {
    return null;
  }

  if (isDevEnv) {
    return Environment.DEV;
  }

  return isTestnet ? Environment.TEST : Environment.PROD;
};
