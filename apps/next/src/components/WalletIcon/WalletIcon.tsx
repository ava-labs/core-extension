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
  if (type === SecretType.Ledger || type === SecretType.LedgerLive) {
    return <LedgerIcon size={size} color={color} />;
  }

  return expanded ? (
    <WalletOpenIcon size={size} color={color} />
  ) : (
    <WalletClosedIcon size={size} color={color} />
  );
};
