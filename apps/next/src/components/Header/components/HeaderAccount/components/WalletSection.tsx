import { TruncatedText } from '../../styledComponents';
import {
  BalanceTooltip,
  Label,
  TextWrapper,
  WalletSectionContainer,
} from '../styled';
import { WalletIcon } from '@/components/WalletIcon';
import { useTranslation } from 'react-i18next';
import { FC, useMemo } from 'react';
import { HeaderWalletDetails } from '../../../types';
import { useHistory } from 'react-router-dom';
import { SecretType, SeedlessAuthProvider } from '@core/types';

type Props = {
  showWalletIcon: boolean;
  shouldTruncateWallet: boolean;
  walletMaxWidth: number | undefined;
  shouldExpandWallet: boolean;
  setIsWalletHovered: (isHovered: boolean) => void;
  isWalletHovered: boolean;
  tooltipLeftPosition: number;
  isBalanceLoading: boolean;
  walletTotalBalance: string;
  wallet: HeaderWalletDetails;
  walletTextRef: React.RefObject<HTMLSpanElement | null>;
  isContainerHovered: boolean;
};

export const WalletSection: FC<Props> = ({
  showWalletIcon,
  shouldTruncateWallet,
  walletMaxWidth,
  shouldExpandWallet,
  setIsWalletHovered,
  isWalletHovered,
  tooltipLeftPosition,
  isBalanceLoading,
  walletTotalBalance,
  wallet,
  walletTextRef,
  isContainerHovered,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const navigateToWallet = () => history.push(`/wallet/${wallet.id}`);

  const walletIconSize = useMemo(() => {
    if (!wallet.type) return 16;

    if (
      wallet.type === SecretType.Ledger ||
      wallet.type === SecretType.LedgerLive ||
      wallet.type === SecretType.Keystone ||
      wallet.type === SecretType.Keystone3Pro ||
      (wallet.type === SecretType.Seedless &&
        wallet.authProvider === SeedlessAuthProvider.Google)
    ) {
      return 12;
    }

    if (
      wallet.type === SecretType.Seedless &&
      wallet.authProvider === SeedlessAuthProvider.Apple
    ) {
      return 14.5;
    }

    return 16;
  }, [wallet.type, wallet.authProvider]);

  return (
    <WalletSectionContainer
      showIcon={showWalletIcon}
      shouldTruncate={shouldTruncateWallet}
      maxWidth={walletMaxWidth}
      shouldExpand={shouldExpandWallet}
      onMouseEnter={() => setIsWalletHovered(true)}
      onMouseLeave={() => setIsWalletHovered(false)}
      onClick={navigateToWallet}
    >
      <BalanceTooltip
        isVisible={isWalletHovered}
        leftPosition={tooltipLeftPosition}
      >
        {isBalanceLoading
          ? t('Balance: Loading...')
          : `${t('Balance')}: ${walletTotalBalance}`}
      </BalanceTooltip>

      {showWalletIcon ? (
        <WalletIcon
          type={wallet.type!}
          authProvider={wallet.authProvider}
          size={walletIconSize}
        />
      ) : (
        <TextWrapper>
          <TruncatedText
            ref={walletTextRef}
            variant="subtitle3"
            showFade={shouldTruncateWallet}
          >
            {wallet.name}
          </TruncatedText>
        </TextWrapper>
      )}

      {isContainerHovered && <Label variant="caption">{t('Wallet')}</Label>}
    </WalletSectionContainer>
  );
};
