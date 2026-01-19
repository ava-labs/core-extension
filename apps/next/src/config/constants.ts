import { TransactionPriority } from '@core/types';

export const CORE_WEB_BASE_URL =
  process.env.CORE_WEB_BASE_URL ?? 'https://core.app';
export const BUG_BOUNTIES_URL =
  'https://immunefi.com/bug-bounty/avalabs/information/';
export const CORE_SUPPORT_URL = 'https://support.core.app/en/';
export const CORE_FEATURE_REQUEST_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdQ9nOPPGjVPmrLXh3B9NR1NuXXUiW2fKW1ylrXpiW_vZB_hw/viewform?entry.2070152111=Core%20browser%20extension';
export const CORE_FEEDBACK_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdUQiVnJoqQ1g_6XTREpkSB5vxKKK8ba5DRjhzQf1XVeET8Rw/viewform?usp=pp_url&entry.2070152111=Core%20browser%20extension&entry.903657115=${extensionVersion}&entry.1148340936=${os}';

export const DARK_THEME_SURFACE_COLOR = '#404046';
export const TESTNET_MODE_BACKGROUND_COLOR = '#383840';

export const HEADER_HEIGHT = 56; // Height of Header and PageTopBar in pixels

export const DEFAULT_FEE_PRESET: TransactionPriority = 'low';
export const DEFAULT_FEE_PRESET_C_CHAIN: TransactionPriority = 'high';
