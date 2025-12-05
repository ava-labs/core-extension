import { SecretType, WalletDetails } from '@core/types';
import { FC } from 'react';
import { LedgerIcon } from './assets/LedgerIcon';
import { WalletOpenIcon } from './assets/WalletOpenIcon';
import { WalletClosedIcon } from './assets/WalletClosedIcon';

export type WalletIconProps = {
  expanded?: boolean;
  size?: number;
  color?: string;
} & Partial<Pick<WalletDetails, 'type' | 'authProvider'>>;

export const WalletIcon: FC<WalletIconProps> = ({
  color = 'currentColor',
  type,
  expanded,
  size = 16,
}) => {
  const Icon =
    type === SecretType.Ledger || type === SecretType.LedgerLive
      ? LedgerIcon
      : expanded
        ? WalletOpenIcon
        : WalletClosedIcon;

  return <Icon size={size} color={color} />;
};
