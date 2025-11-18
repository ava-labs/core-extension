import {
  KeystoneIcon,
  LedgerIcon,
  WalletClosedIcon,
  WalletOpenIcon,
} from '@avalabs/k2-alpine';
import { SecretType, SeedlessAuthProvider, WalletDetails } from '@core/types';
import { FC } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';

export type WalletIconProps = {
  expanded?: boolean;
  size?: number;
} & Pick<WalletDetails, 'type' | 'authProvider'>;

export const WalletIcon: FC<WalletIconProps> = ({
  type,
  authProvider,
  expanded,
  size,
}) => {
  if (type === SecretType.Ledger || type === SecretType.LedgerLive) {
    return <LedgerIcon size={size ?? 16} />;
  }

  if (type === SecretType.Seedless) {
    if (authProvider === SeedlessAuthProvider.Google) {
      return <FaGoogle size={size ?? 16} />;
    }

    if (authProvider === SeedlessAuthProvider.Apple) {
      return <FaApple size={size ?? 16} />;
    }
  }

  if (type === SecretType.Keystone || type === SecretType.Keystone3Pro) {
    return <KeystoneIcon size={size ?? 14} />;
  }

  const MnemonicIcon = expanded ? WalletOpenIcon : WalletClosedIcon;
  return <MnemonicIcon size={size ?? 21} />;
};
