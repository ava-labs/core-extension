import {
  AppleIcon,
  GoogleIcon,
  IconBaseProps,
  KeystoneIcon,
  LedgerIcon,
  ListIcon,
  SxProps,
  Theme,
} from '@avalabs/core-k2-components';

import { SecretType, SeedlessAuthProvider, WalletDetails } from '@core/types';

type WalletTypeIconProps = IconBaseProps & {
  walletDetails: WalletDetails;
  sx?: SxProps<Theme>;
};

export const WalletTypeIcon = ({
  walletDetails,
  sx,
  ...props
}: WalletTypeIconProps) => {
  // Cast sx to resolve MUI version conflicts between different system installations
  const iconProps = { ...props, sx: sx as any };

  switch (walletDetails.type) {
    case SecretType.Mnemonic:
      return <ListIcon {...iconProps} />;

    case SecretType.Keystone:
    case SecretType.Keystone3Pro:
      return <KeystoneIcon {...iconProps} />;

    case SecretType.Ledger:
    case SecretType.LedgerLive:
      return <LedgerIcon {...iconProps} />;

    case SecretType.Seedless:
      {
        if (walletDetails.authProvider === SeedlessAuthProvider.Apple) {
          return <AppleIcon {...iconProps} />;
        } else if (walletDetails.authProvider === SeedlessAuthProvider.Google) {
          return <GoogleIcon {...iconProps} />;
        }
        return null;
      }
      break;

    default:
      return null;
  }
};
