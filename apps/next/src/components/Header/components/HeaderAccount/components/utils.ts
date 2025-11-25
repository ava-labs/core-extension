import { SecretType, SeedlessAuthProvider } from '@core/types';

import { HeaderWalletDetails } from '@/components/Header/types';

const WALLET_ICON_SIZES = {
  DEFAULT: 16,
  SMALL: 12,
  MEDIUM: 14.5,
} as const;

export const getWalletIconSize = (wallet: HeaderWalletDetails) => {
  if (!wallet.type) return WALLET_ICON_SIZES.DEFAULT;

  if (
    wallet.type === SecretType.Ledger ||
    wallet.type === SecretType.LedgerLive ||
    wallet.type === SecretType.Keystone ||
    wallet.type === SecretType.Keystone3Pro ||
    (wallet.type === SecretType.Seedless &&
      wallet.authProvider === SeedlessAuthProvider.Google)
  ) {
    return WALLET_ICON_SIZES.SMALL;
  }

  if (
    wallet.type === SecretType.Seedless &&
    wallet.authProvider === SeedlessAuthProvider.Apple
  ) {
    return WALLET_ICON_SIZES.MEDIUM;
  }

  return WALLET_ICON_SIZES.DEFAULT;
};
