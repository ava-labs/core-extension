import {} from // ACCOUNTS_STORAGE_KEY,
// WALLET_STORAGE_ENCRYPTION_KEY,
// WALLET_STORAGE_KEY,
// NETWORK_STORAGE_KEY,
// SETTINGS_STORAGE_KEY,
// BALANCES_CACHE_KEY,
// UNIFIED_BRIDGE_STATE_STORAGE_KEY,
// PERMISSION_STORAGE_KEY,
'@core/types';
import accounts_v2 from './migrations/accounts_v2';
import wallet_v2 from './migrations/wallet_v2';
import wallet_v3 from './migrations/wallet_v3';
import network_v2 from './migrations/network_v2';
import wallet_storage_encryption_key_v2 from './migrations/wallet_storage_encryption_key_v2';
import accounts_v3 from './migrations/accounts_v3';
import wallet_v4 from './migrations/wallet_v4';
import settings_v2 from './migrations/settings_v2';
import balances_v2 from './migrations/balances_v2';
import network_v3 from './migrations/network_v3';
import network_v4 from './migrations/network_v4';
import unified_bridge_v2 from './migrations/unified_bridge_v2';
import balances_v3 from './migrations/balances_v3';
import wallet_v5 from './migrations/wallet_v5/wallet_v5';
import permissions_v2 from './migrations/permissions_v2';
import wallet_v6 from './migrations/wallet_v6/wallet_v6';

export const SCHEMA_MAP = {
  ['accounts']: {
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
  ['wallet']: {
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
  ['NETWORK_STORAGE_KEY']: {
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
  ['WALLET_STORAGE_ENCRYPTION_KEY']: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: wallet_storage_encryption_key_v2,
      },
    ],
  },
  ['settings']: {
    latestVersion: 2,
    migrations: [
      {
        version: 2,
        migration: settings_v2,
      },
    ],
  },
  ['balances-service-cache']: {
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
  ['UNIFIED_BRIDGE_STATE']: {
    latestVersion: 2,
    migrations: [{ version: 2, migration: unified_bridge_v2 }],
  },
  ['permissions']: {
    latestVersion: 2,
    migrations: [{ version: 2, migration: permissions_v2 }],
  },
} as const;
