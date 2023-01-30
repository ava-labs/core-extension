import Joi from 'joi';
import { ACCOUNTS_STORAGE_KEY } from '../../accounts/models';
import { WALLET_STORAGE_KEY } from '@src/background/services/wallet/models';
import { NETWORK_STORAGE_KEY } from '@src/background/services/network/models';
import accounts_v2 from './migrations/accounts_v2';
import wallet_v2 from './migrations/wallet_v2';
import wallet_v3 from './migrations/wallet_v3';
import network_v2 from './migrations/network_v2';

export type Migration = {
  previousSchema: Joi.Schema;
  up: <T>(data: T) => Promise<T & { version: number }>;
};

export type SchemaMap = Record<
  string,
  {
    latestVersion: number;
    migrations: readonly {
      version: number;
      migration: Migration;
    }[];
  }
>;

export const SCHEMA_MAP = {
  [ACCOUNTS_STORAGE_KEY]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: accounts_v2,
      },
    ],
  },
  [WALLET_STORAGE_KEY]: {
    latestVersion: 3,
    migrations: [
      {
        version: 2,
        migration: wallet_v2,
      },
      {
        version: 3,
        migration: wallet_v3,
      },
    ],
  },
  [NETWORK_STORAGE_KEY]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: network_v2,
      },
    ],
  },
} as const;
