import { SecretType, SeedlessAuthProvider, WalletDetails } from '@core/types';
import { FC } from 'react';
import { LedgerIcon } from './assets/LedgerIcon';
import { WalletClosedIcon } from './assets/WalletClosedIcon';
import { FaApple } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';
import { WalletOpenIcon } from '@avalabs/k2-alpine';

export type WalletIconProps = {
  expanded?: boolean;
  size?: number;
  color?: string;
} & Partial<Pick<WalletDetails, 'type' | 'authProvider'>>;

const getWalletIcon = (
  type?: SecretType,
  authProvider?: SeedlessAuthProvider,
  expanded?: boolean,
) => {
  // Seedless wallets with specific auth providers
  if (type === SecretType.Seedless) {
    if (authProvider === SeedlessAuthProvider.Google) {
      return FaGoogle;
    }
    if (authProvider === SeedlessAuthProvider.Apple) {
      return FaApple;
    }
  }

  // Ledger wallets (same icon for both Ledger and LedgerLive)
  if (type === SecretType.Ledger || type === SecretType.LedgerLive) {
    return LedgerIcon;
  }

  // Default wallet icon (same for open and close)
  return expanded ? WalletOpenIcon : WalletClosedIcon;
};

export const WalletIcon: FC<WalletIconProps> = ({
  color = 'currentColor',
  type,
  expanded,
  authProvider,
  size = 16,
}) => {
  const Icon = getWalletIcon(type, authProvider, expanded);

  return <Icon size={size} color={color} />;
};
