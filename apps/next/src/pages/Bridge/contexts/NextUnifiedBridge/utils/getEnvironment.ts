import { Environment } from '@avalabs/bridge-unified';
import { memoize } from 'lodash';

export const getEnvironment = memoize(
  (isTestnet: boolean | undefined, isDevEnv: boolean) => {
    if (typeof isTestnet !== 'boolean') {
      return null;
    }

    return isDevEnv
      ? Environment.DEV
      : isTestnet
        ? Environment.TEST
        : Environment.PROD;
  },
  (...args) => args.join('-'),
);
