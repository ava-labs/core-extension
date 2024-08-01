import { useTranslation } from 'react-i18next';
import {
  Button,
  CoinbaseWalletIcon,
  CoreIcon,
  MetaMaskIcon,
  WalletIcon,
} from '@avalabs/core-k2-components';

import { WalletExtensionType } from '@src/background/services/web3/models';

interface WalletExtensionButtonProps {
  type: WalletExtensionType;
  onClick: () => void;
}

export function WalletExtensionButton({
  type,
  onClick,
}: WalletExtensionButtonProps) {
  const { t } = useTranslation();

  const getWalletDisplayName = (walletType: WalletExtensionType) => {
    switch (walletType) {
      case WalletExtensionType.METAMASK:
        return 'Metamask';
      case WalletExtensionType.COINBASE:
        return 'Coinbase';
      case WalletExtensionType.UNKNOWN:
      default:
        return t('Unknown wallet');
    }
  };

  const getWalletLogo = (walletType: WalletExtensionType) => {
    switch (walletType) {
      case WalletExtensionType.METAMASK:
        return <MetaMaskIcon size={24} />;
      case WalletExtensionType.COINBASE:
        return <CoinbaseWalletIcon size={24} />;
      case WalletExtensionType.UNKNOWN:
      default:
        return <WalletIcon size={24} />;
    }
  };

  if (type === WalletExtensionType.CORE) {
    return (
      <Button
        color="secondary"
        size="large"
        onClick={onClick}
        sx={{ mt: 2, gap: 1 }}
        fullWidth
      >
        <CoreIcon size={24} />
        Core
      </Button>
    );
  }

  return (
    <Button
      color="secondary"
      size="large"
      sx={{ gap: 1, mt: 2 }}
      onClick={onClick}
      fullWidth
    >
      {getWalletLogo(type)}
      {getWalletDisplayName(type)}
    </Button>
  );
}
