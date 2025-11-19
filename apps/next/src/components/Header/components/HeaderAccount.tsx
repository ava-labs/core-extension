import { styled, Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC, useState, useRef, useEffect, useMemo } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { HeaderWalletDetails } from '../types';
import { useHistory } from 'react-router-dom';
import { WalletIcon } from '@/components/WalletIcon';
import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
  useWalletTotalBalance,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { useTranslation } from 'react-i18next';

type Props = {
  wallet: HeaderWalletDetails;
  isTrueWallet: boolean;
  account?: Account;
};

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  width: '128px',
  minWidth: 0,
  overflow: 'visible',
}));

const WalletSection = styled('div')<{
  showIcon: boolean;
  shouldTruncate: boolean;
  maxWidth?: number;
  shouldExpand: boolean;
}>(({ theme, showIcon, shouldTruncate, maxWidth, shouldExpand }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  width: 'fit-content',
  maxWidth: showIcon
    ? 'none'
    : shouldTruncate && maxWidth
      ? `${maxWidth + (shouldExpand ? 20 : 0)}px`
      : shouldTruncate
        ? '45%'
        : 'none',
  flexShrink: shouldTruncate ? 1 : 0,
  flexGrow: 0,
  cursor: 'pointer',
  position: 'relative',
  justifyContent: 'center',
  overflow: 'visible',
  transition: theme.transitions.create(['max-width'], {
    duration: theme.transitions.duration.short,
  }),
}));

const AccountSection = styled('div')<{ shouldShift: boolean }>(
  ({ theme, shouldShift }) => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    cursor: 'pointer',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible',
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
    transform: shouldShift ? 'translateX(8px)' : 'translateX(0)',
  }),
);

const TruncatedText = styled(Typography)<{
  showFade?: boolean;
}>(({ theme, showFade }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  position: 'relative',
  display: 'block',
  textOverflow: 'clip',
  '&::after': showFade
    ? {
        content: '""',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '24px',
        background: `linear-gradient(to right, transparent, ${theme.palette.background.default})`,
        pointerEvents: 'none',
      }
    : {},
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: '10px',
  opacity: 0.6,
  position: 'absolute',
  top: '100%',
  left: 0,
  whiteSpace: 'nowrap',
  marginTop: theme.spacing(0.25),
  zIndex: 10,
}));

const BalanceTooltip = styled('div')<{
  isVisible: boolean;
  leftPosition: number;
}>(({ theme, isVisible, leftPosition }) => ({
  position: 'fixed',
  top: 0,
  left: `${leftPosition - 6}px`, // Subtract padding to align with text
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1.5),
  backgroundColor: theme.palette.grey[700],
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  fontSize: '10px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  opacity: isVisible ? 1 : 0,
  pointerEvents: isVisible ? 'auto' : 'none',
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.shorter,
  }),
  zIndex: theme.zIndex.tooltip,
  boxShadow: theme.shadows[4],
}));

const IconWrapper = styled('div')<{ shouldShift: boolean }>(
  ({ theme, shouldShift }) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
    transform: shouldShift ? 'translateX(8px)' : 'translateX(0)',
  }),
);

const HeaderAccountContent: FC<Props> = ({ wallet, isTrueWallet, account }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isWalletHovered, setIsWalletHovered] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [isWalletTruncated, setIsWalletTruncated] = useState(false);
  const [isAccountTruncated, setIsAccountTruncated] = useState(false);
  const [showWalletIcon, setShowWalletIcon] = useState(false);
  const [shouldTruncateWallet, setShouldTruncateWallet] = useState(false);
  const [walletMaxWidth, setWalletMaxWidth] = useState<number | undefined>(
    undefined,
  );
  const [tooltipLeftPosition, setTooltipLeftPosition] = useState(0);
  const walletTextRef = useRef<HTMLSpanElement>(null);
  const accountTextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { totalBalanceInCurrency, isLoading } = useWalletTotalBalance(
    wallet.id,
  );
  const { getTotalBalance } = useBalancesContext();
  const { getAccountById } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();

  const walletTotalBalance = useMemo(() => {
    if (isTrueWallet) {
      return totalBalanceInCurrency
        ? `${currencyFormatter(totalBalanceInCurrency)} ${currency}`
        : `- ${currency}`;
    }
    const accountForBalance = getAccountById(wallet.id);
    if (!accountForBalance) {
      return `- ${currency}`;
    }
    const accountBalance = getTotalBalance(accountForBalance?.addressC);
    return accountBalance && accountBalance.sum
      ? `${currencyFormatter(accountBalance.sum)} ${currency}`
      : `- ${currency}`;
  }, [
    currency,
    currencyFormatter,
    getAccountById,
    getTotalBalance,
    isTrueWallet,
    totalBalanceInCurrency,
    wallet.id,
  ]);

  useEffect(() => {
    const checkLayout = () => {
      const CONTAINER_WIDTH = 128;
      const ICON_WIDTH = 20; // MdNavigateNext icon
      const GAP = 4; // theme.spacing(0.5) = 4px

      // Create temporary elements to measure text widths
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.whiteSpace = 'nowrap';
      tempContainer.style.fontSize = '14px'; // subtitle3
      document.body.appendChild(tempContainer);

      // Measure wallet name width
      tempContainer.textContent = wallet.name;
      const walletNameWidth = tempContainer.offsetWidth;

      // Measure account name width
      tempContainer.textContent = account?.name || '';
      const accountNameWidth = tempContainer.offsetWidth;

      document.body.removeChild(tempContainer);

      // Calculate total width needed for all elements
      const totalWidth =
        walletNameWidth + GAP + ICON_WIDTH + GAP + accountNameWidth;

      if (totalWidth <= CONTAINER_WIDTH) {
        // Everything fits - show full wallet name, no truncation
        setShouldTruncateWallet(false);
        setShowWalletIcon(false);
        setIsWalletTruncated(false);
        setWalletMaxWidth(undefined);
      } else {
        // Need to truncate - calculate available space for wallet to prevent account truncation
        const WALLET_ICON_WIDTH = 20;

        // Space needed for account to not truncate: accountName + gap + icon + gap
        const spaceNeededForAccount = accountNameWidth + GAP + ICON_WIDTH + GAP;

        // Space available for wallet
        const spaceForWallet = CONTAINER_WIDTH - spaceNeededForAccount;

        if (spaceForWallet < WALLET_ICON_WIDTH && wallet.type) {
          // Wallet space is less than icon width, show icon instead
          setShowWalletIcon(true);
          setShouldTruncateWallet(false);
          setIsWalletTruncated(false);
          setWalletMaxWidth(undefined);
        } else {
          // Wallet space is >= icon width, show truncated wallet name
          setShouldTruncateWallet(true);
          setShowWalletIcon(false);
          setIsWalletTruncated(walletNameWidth > spaceForWallet);
          setWalletMaxWidth(spaceForWallet);
        }
      }

      // Check if account is truncated
      if (accountTextRef.current) {
        const isTruncated =
          accountTextRef.current.scrollWidth >
          accountTextRef.current.clientWidth;
        setIsAccountTruncated(isTruncated);
      }

      // Update tooltip position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipLeftPosition(rect.left);
      }
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, [wallet.name, wallet.type, account?.name]);

  return (
    <Container
      ref={containerRef}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      <WalletSection
        showIcon={showWalletIcon}
        shouldTruncate={shouldTruncateWallet}
        maxWidth={walletMaxWidth}
        shouldExpand={isWalletHovered && isWalletTruncated}
        onMouseEnter={() => setIsWalletHovered(true)}
        onMouseLeave={() => setIsWalletHovered(false)}
        onClick={() => history.push(`/wallet/${wallet.id}`)}
      >
        <BalanceTooltip
          isVisible={isWalletHovered}
          leftPosition={tooltipLeftPosition}
        >
          {isLoading
            ? t('Balance: Loading...')
            : `${t('Balance')}: ${walletTotalBalance}`}
        </BalanceTooltip>
        {showWalletIcon ? (
          <WalletIcon type={wallet.type!} authProvider={wallet.authProvider} />
        ) : (
          <TruncatedText
            ref={walletTextRef}
            variant="subtitle3"
            showFade={shouldTruncateWallet}
          >
            {wallet.name}
          </TruncatedText>
        )}
        {isContainerHovered && <Label variant="caption">Wallet</Label>}
      </WalletSection>
      <IconWrapper shouldShift={false}>
        <MdNavigateNext />
      </IconWrapper>
      <AccountSection
        shouldShift={false}
        onClick={() => history.push(`/portfolio`)}
      >
        <TruncatedText
          ref={accountTextRef}
          variant="subtitle3"
          showFade={isAccountTruncated}
        >
          {account?.name}
        </TruncatedText>
        {isContainerHovered && <Label variant="caption">Account</Label>}
      </AccountSection>
    </Container>
  );
};

export const HeaderAccount: FC<Props> = ({ wallet, isTrueWallet, account }) => {
  return (
    <WalletTotalBalanceProvider>
      <HeaderAccountContent
        wallet={wallet}
        isTrueWallet={isTrueWallet}
        account={account}
      />
    </WalletTotalBalanceProvider>
  );
};
