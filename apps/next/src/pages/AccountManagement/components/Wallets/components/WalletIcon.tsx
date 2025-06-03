import { SecretType, SeedlessAuthProvider, WalletDetails } from '@core/types';
import { FC } from 'react';
import {
  LedgerIcon,
  WalletOpenIcon,
  WalletClosedIcon,
} from '@avalabs/k2-alpine';
import { FaApple, FaGoogle } from 'react-icons/fa';

type Props = {
  wallet: WalletDetails;
  expanded: boolean;
};

export const WalletIcon: FC<Props> = ({ wallet, expanded }) => {
  if (
    wallet.type === SecretType.Ledger ||
    wallet.type === SecretType.LedgerLive
  ) {
    return <LedgerIcon size={16} />;
  }

  if (wallet.type === SecretType.Seedless) {
    if (wallet.authProvider === SeedlessAuthProvider.Google) {
      return <FaGoogle size={16} />;
    }

    if (wallet.authProvider === SeedlessAuthProvider.Apple) {
      return <FaApple size={16} />;
    }
  }

  const MnemonicIcon = expanded ? WalletOpenIcon : WalletClosedIcon;
  return <MnemonicIcon size={21} />;
};
