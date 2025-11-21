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
import { AddressList } from '../AddressList';

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
}>(({ theme, showIcon, shouldTruncate, maxWidth, shouldExpand }) => {
  // Determine maxWidth based on display mode
  let computedMaxWidth = 'none';
  if (!showIcon && shouldTruncate) {
    if (maxWidth) {
      const expandedWidth = maxWidth + (shouldExpand ? HOVER_EXPANSION : 0);
      computedMaxWidth = `${expandedWidth}px`;
    } else {
      computedMaxWidth = '45%'; // Fallback
    }
  }

  return {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: 'fit-content',
    maxWidth: computedMaxWidth,
    flexShrink: shouldTruncate ? 1 : 0,
    flexGrow: 0,
    cursor: 'pointer',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible',
    transition: theme.transitions.create(['max-width'], {
      duration: theme.transitions.duration.short,
    }),
  };
});

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

// Text that truncates with a fade gradient effect
const TruncatedText = styled(Typography)<{ showFade?: boolean }>(
  ({ theme, showFade }) => ({
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
  }),
);

// Small label shown below sections on hover
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

// Tooltip showing wallet balance, fixed to top of screen
const BalanceTooltip = styled('div')<{
  isVisible: boolean;
  leftPosition: number;
}>(({ theme, isVisible, leftPosition }) => ({
  position: 'fixed',
  top: 0,
  left: `${leftPosition - 6}px`,
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

// Layout constants
const CONTAINER_WIDTH = 128;
const NAVIGATE_ICON_WIDTH = 20;
const WALLET_ICON_WIDTH = 20;
const GAP = 4;
const HOVER_EXPANSION = 20;

// Helper to measure text width
const measureTextWidth = (text: string): number => {
  const temp = document.createElement('div');
  temp.style.cssText =
    'position:absolute;visibility:hidden;white-space:nowrap;font-size:14px';
  temp.textContent = text;
  document.body.appendChild(temp);
  const width = temp.offsetWidth;
  document.body.removeChild(temp);
  return width;
};

// Layout state for wallet display
type WalletLayout = {
  showIcon: boolean;
  shouldTruncate: boolean;
  isTruncated: boolean;
  maxWidth: number | undefined;
};

// Calculate wallet layout based on available space
const calculateWalletLayout = (
  walletNameWidth: number,
  accountNameWidth: number,
  hasWalletIcon: boolean,
): WalletLayout => {
  const totalNeeded =
    walletNameWidth + GAP + NAVIGATE_ICON_WIDTH + GAP + accountNameWidth;

  // Scenario 1: Everything fits
  if (totalNeeded <= CONTAINER_WIDTH) {
    return {
      showIcon: false,
      shouldTruncate: false,
      isTruncated: false,
      maxWidth: undefined,
    };
  }

  // Scenario 2: Need to truncate wallet
  const spaceForAccount = accountNameWidth + GAP + NAVIGATE_ICON_WIDTH + GAP;
  const spaceForWallet = CONTAINER_WIDTH - spaceForAccount;

  // Scenario 3: Show icon if wallet would be too narrow
  if (spaceForWallet < WALLET_ICON_WIDTH && hasWalletIcon) {
    return {
      showIcon: true,
      shouldTruncate: false,
      isTruncated: false,
      maxWidth: undefined,
    };
  }

  // Scenario 4: Truncate wallet name
  return {
    showIcon: false,
    shouldTruncate: true,
    isTruncated: walletNameWidth > spaceForWallet,
    maxWidth: spaceForWallet,
  };
};

const HeaderAccountContent: FC<Props> = ({ wallet, isTrueWallet, account }) => {
  const { t } = useTranslation();
  const history = useHistory();

  // Hover state
  const [isWalletHovered, setIsWalletHovered] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);

  // Layout state (calculated from text widths)
  const [showWalletIcon, setShowWalletIcon] = useState(false);
  const [shouldTruncateWallet, setShouldTruncateWallet] = useState(false);
  const [walletMaxWidth, setWalletMaxWidth] = useState<number | undefined>();
  const [isWalletTruncated, setIsWalletTruncated] = useState(false);
  const [isAccountTruncated, setIsAccountTruncated] = useState(false);

  // Tooltip position
  const [tooltipLeftPosition, setTooltipLeftPosition] = useState(0);

  // DOM refs for measuring
  const walletTextRef = useRef<HTMLSpanElement>(null);
  const accountTextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Balance data
  const { totalBalanceInCurrency, isLoading } = useWalletTotalBalance(
    wallet.id,
  );
  const { getTotalBalance } = useBalancesContext();
  const { getAccountById } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();

  const walletTotalBalance = useMemo(() => {
    const placeholderTotalBalance = currencyFormatter(0).replace('0.00', ' -');
    const placeholderBalance = `${placeholderTotalBalance} ${currency}`;

    if (isTrueWallet) {
      return totalBalanceInCurrency
        ? `${currencyFormatter(totalBalanceInCurrency)} ${currency}`
        : placeholderBalance;
    }
    const accountForBalance = getAccountById(wallet.id);
    if (!accountForBalance) {
      return placeholderBalance;
    }
    const accountBalance = getTotalBalance(accountForBalance?.addressC);
    return accountBalance && accountBalance.sum
      ? `${currencyFormatter(accountBalance.sum)} ${currency}`
      : placeholderBalance;
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
    const updateLayout = () => {
      // Measure text widths
      const walletNameWidth = measureTextWidth(wallet.name);
      const accountNameWidth = measureTextWidth(account?.name || '');

      // Calculate wallet display layout
      const layout = calculateWalletLayout(
        walletNameWidth,
        accountNameWidth,
        Boolean(wallet.type),
      );

      // Update wallet state
      setShowWalletIcon(layout.showIcon);
      setShouldTruncateWallet(layout.shouldTruncate);
      setIsWalletTruncated(layout.isTruncated);
      setWalletMaxWidth(layout.maxWidth);

      // Check if account text is truncated (via DOM comparison)
      if (accountTextRef.current) {
        setIsAccountTruncated(
          accountTextRef.current.scrollWidth >
            accountTextRef.current.clientWidth,
        );
      }

      // Update tooltip position
      if (containerRef.current) {
        setTooltipLeftPosition(
          containerRef.current.getBoundingClientRect().left,
        );
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [wallet.name, wallet.type, account?.name]);

  const shouldExpandWallet = isWalletHovered && isWalletTruncated;
  const navigateToWallet = () => history.push(`/wallet/${wallet.id}`);
  const navigateToPortfolio = () => history.push(`/portfolio`);

  return (
    <Container
      ref={containerRef}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      {/* Wallet Name or Icon */}
      <WalletSection
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

      {/* Navigation Arrow */}
      <IconWrapper shouldShift={false}>
        <MdNavigateNext />
      </IconWrapper>

      {/* Account Name */}
      <AccountSection
        shouldShift={false}
        onClick={navigateToPortfolio}
        onMouseEnter={() => setIsAccountHovered(true)}
        onMouseLeave={() => setIsAccountHovered(false)}
      >
        <TruncatedText
          ref={accountTextRef}
          variant="subtitle3"
          showFade={isAccountTruncated}
        >
          {account?.name}
        </TruncatedText>
        {isContainerHovered && <Label variant="caption">Account</Label>}
        <AddressList
          isAddressAppear={isAccountHovered}
          activeAccount={account}
        />
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
