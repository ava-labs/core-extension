import {
  CoinbaseIcon,
  ComponentSize,
  CoreIcon,
  MetamaskColored,
  PrimaryButton,
  RabbyIcon,
  SecondaryButton,
  Typography,
  WalletIcon,
} from '@avalabs/react-components';
import { WalletExtensionType } from '@src/background/services/web3/models';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

interface WalletExtensionButtonProps {
  type: WalletExtensionType;
  onClick: () => void;
}

export function WalletExtensionButton({
  type,
  onClick,
}: WalletExtensionButtonProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const getWalletDisplayName = (type: WalletExtensionType) => {
    switch (type) {
      case WalletExtensionType.METAMASK:
        return 'Metamask';
      case WalletExtensionType.COINBASE:
        return 'Coinbase';
      case WalletExtensionType.RABBY:
        return 'Rabby';
      case WalletExtensionType.UNKNOWN:
      default:
        return t('Unknown wallet');
    }
  };

  const getWalletLogo = (type: WalletExtensionType) => {
    switch (type) {
      case WalletExtensionType.METAMASK:
        return <MetamaskColored />;
      case WalletExtensionType.COINBASE:
        return <CoinbaseIcon />;
      case WalletExtensionType.RABBY:
        return <RabbyIcon color={theme.colors.text1} />;
      case WalletExtensionType.UNKNOWN:
      default:
        return <WalletIcon />;
    }
  };

  if (type === WalletExtensionType.CORE) {
    return (
      <PrimaryButton width="343px" size={ComponentSize.LARGE} onClick={onClick}>
        <CoreIcon />
        <Typography margin="0 0 0 8px" color="inherit" weight={600}>
          Core
        </Typography>
      </PrimaryButton>
    );
  }

  return (
    <SecondaryButton
      width="343px"
      margin="16px 0 0 0"
      size={ComponentSize.LARGE}
      onClick={onClick}
    >
      {getWalletLogo(type)}
      <Typography margin="0 0 0 8px" color="inherit" weight={600}>
        {getWalletDisplayName(type)}
      </Typography>
    </SecondaryButton>
  );
}
