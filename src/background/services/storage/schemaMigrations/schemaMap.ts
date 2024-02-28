import Joi from 'joi';
import { ACCOUNTS_STORAGE_KEY } from '../../accounts/models';
import { WALLET_STORAGE_ENCRYPTION_KEY } from '../models';
import { WALLET_STORAGE_KEY } from '@src/background/services/wallet/models';
import { NETWORK_STORAGE_KEY } from '@src/background/services/network/models';
import accounts_v2 from './migrations/accounts_v2';
import wallet_v2 from './migrations/wallet_v2';
import wallet_v3 from './migrations/wallet_v3';
import network_v2 from './migrations/network_v2';
import wallet_storage_encryption_key_v2 from './migrations/wallet_storage_encryption_key_v2';
import accounts_v3 from './migrations/accounts_v3';
import wallet_v4 from './migrations/wallet_v4';
import { SETTINGS_STORAGE_KEY } from '../../settings/models';
import settings_v2 from './migrations/settings_v2';

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
    latestVersion: 3,
    migrations: [
      {
        version: 2,
        migration: accounts_v2,
      },
      {
        version: 3,
        migration: accounts_v3,
      },
    ],
  },
  [WALLET_STORAGE_KEY]: {
    latestVersion: 4,
    migrations: [
      {
        version: 2,
        migration: wallet_v2,
      },
      {
        version: 3,
        migration: wallet_v3,
      },
      {
        version: 4,
        migration: wallet_v4,
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
  [WALLET_STORAGE_ENCRYPTION_KEY]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: wallet_storage_encryption_key_v2,
      },
    ],
  },
  [SETTINGS_STORAGE_KEY]: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: settings_v2,
      },
    ],
  },
} as const;
