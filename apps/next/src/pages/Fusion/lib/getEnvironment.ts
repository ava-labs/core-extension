import { Environment } from '@avalabs/fusion-sdk';

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
