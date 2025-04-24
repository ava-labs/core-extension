import {
  AppleIcon,
  GoogleIcon,
  IconBaseProps,
  KeystoneIcon,
  LedgerIcon,
  ListIcon,
  SxProps,
} from '@avalabs/core-k2-components';

import { SecretType } from '@core/service-worker';
import {
  SeedlessAuthProvider,
  WalletDetails,
} from '@core/service-worker';

type WalletTypeIconProps = IconBaseProps & {
  walletDetails: WalletDetails;
  sx?: SxProps;
};

export const WalletTypeIcon = ({
  walletDetails,
  ...props
}: WalletTypeIconProps) => {
  switch (walletDetails.type) {
    case SecretType.Mnemonic:
      return <ListIcon {...props} />;

    case SecretType.Keystone:
      return <KeystoneIcon {...props} />;

    case SecretType.Ledger:
    case SecretType.LedgerLive:
      return <LedgerIcon {...props} />;

    case SecretType.Seedless:
      {
        if (walletDetails.authProvider === SeedlessAuthProvider.Apple) {
          return <AppleIcon {...props} />;
        } else if (walletDetails.authProvider === SeedlessAuthProvider.Google) {
          return <GoogleIcon {...props} />;
        }
        return null;
      }
      break;

    default:
      return null;
  }
};
