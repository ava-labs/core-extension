import {
  AppleIcon,
  GoogleIcon,
  IconBaseProps,
  KeystoneIcon,
  LedgerIcon,
  ListIcon,
} from '@avalabs/k2-components';
import {
  SeedlessAuthProvider,
  WalletType,
} from '@src/background/services/wallet/models';
import { useWalletContext } from '@src/contexts/WalletProvider';

export const WalletTypeIcon = (props: IconBaseProps) => {
  const { walletDetails } = useWalletContext();
  const type = walletDetails?.type;
  const provider = walletDetails?.authProvider;

  switch (type) {
    case WalletType.MNEMONIC:
      return <ListIcon {...props} />;

    case WalletType.KEYSTONE:
      return <KeystoneIcon {...props} />;

    case WalletType.LEDGER:
      return <LedgerIcon {...props} />;

    case WalletType.SEEDLESS:
      {
        if (provider === SeedlessAuthProvider.Apple) {
          return <AppleIcon {...props} />;
        } else if (provider === SeedlessAuthProvider.Google) {
          return <GoogleIcon {...props} />;
        }
        return null;
      }
      break;

    default:
      return null;
  }
};
