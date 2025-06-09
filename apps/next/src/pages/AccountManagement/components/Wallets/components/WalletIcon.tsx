import {
  LedgerIcon,
  WalletClosedIcon,
  WalletOpenIcon,
} from '@avalabs/k2-alpine';
import { SecretType, SeedlessAuthProvider, WalletDetails } from '@core/types';
import { FC } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';

type Props = {
  expanded: boolean;
} & Pick<WalletDetails, 'type' | 'authProvider'>;

export const WalletIcon: FC<Props> = ({ type, authProvider, expanded }) => {
  if (type === SecretType.Ledger || type === SecretType.LedgerLive) {
    return <LedgerIcon size={16} />;
  }

  if (type === SecretType.Seedless) {
    if (authProvider === SeedlessAuthProvider.Google) {
      return <FaGoogle size={16} />;
    }

    if (authProvider === SeedlessAuthProvider.Apple) {
      return <FaApple size={16} />;
    }
  }

  const MnemonicIcon = expanded ? WalletOpenIcon : WalletClosedIcon;
  return <MnemonicIcon size={21} />;
};
