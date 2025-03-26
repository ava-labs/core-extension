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
import { BALANCES_CACHE_KEY } from '../../balances/models';
import balances_v2 from './migrations/balances_v2';
import network_v3 from './migrations/network_v3';
import network_v4 from './migrations/network_v4';
import { UNIFIED_BRIDGE_STATE_STORAGE_KEY } from '../../unifiedBridge/models';
import unified_bridge_v2 from './migrations/unified_bridge_v2';
import balances_v3 from './migrations/balances_v3';
import wallet_v5 from './migrations/wallet_v5/wallet_v5';
import { PERMISSION_STORAGE_KEY } from '../../permissions/models';
import permissions_v2 from './migrations/permissions_v2';
import wallet_v6 from './migrations/wallet_v6/wallet_v6';

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
    latestVersion: 6,
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
      {
        version: 5,
        migration: wallet_v5,
      },
      {
        version: 6,
        migration: wallet_v6,
      },
    ],
  },
  [NETWORK_STORAGE_KEY]: {
    latestVersion: 4,
    migrations: [
      {
        version: 2,
        migration: network_v2,
      },
      {
        version: 3,
        migration: network_v3,
      },
      {
        version: 4,
        migration: network_v4,
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
  [BALANCES_CACHE_KEY]: {
    latestVersion: 3,
    migrations: [
      {
        version: 2,
        migration: balances_v2,
      },
      {
        version: 3,
        migration: balances_v3,
      },
    ],
  },
  [UNIFIED_BRIDGE_STATE_STORAGE_KEY]: {
    latestVersion: 2,
    migrations: [{ version: 2, migration: unified_bridge_v2 }],
  },
  [PERMISSION_STORAGE_KEY]: {
    latestVersion: 2,
    migrations: [{ version: 2, migration: permissions_v2 }],
  },
} as const;
