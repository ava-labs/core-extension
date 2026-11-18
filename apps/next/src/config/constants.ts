import { TransactionPriority } from '@core/types';

export const CORE_WEB_BASE_URL =
  process.env.CORE_WEB_BASE_URL ?? 'https://core.app';
export const BUG_BOUNTIES_URL =
  'https://immunefi.com/bug-bounty/avalabs/information/';
export const CORE_SUPPORT_URL = 'https://support.core.app/en/';

export const DARK_THEME_SURFACE_COLOR = '#404046';
export const TESTNET_MODE_BACKGROUND_COLOR = '#383840';

export const HEADER_HEIGHT = 56; // Height of Header and PageTopBar in pixels

export const DEFAULT_FEE_PRESET: TransactionPriority = 'low';
export const DEFAULT_FEE_PRESET_C_CHAIN: TransactionPriority = 'high';
