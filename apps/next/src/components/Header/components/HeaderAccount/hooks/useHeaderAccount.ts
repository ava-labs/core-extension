import {
  useAccountsContext,
  useBalancesContext,
  useSettingsContext,
  useWalletTotalBalance,
} from '@core/ui';
import { useEffect, useMemo, useState } from 'react';
import { calculateWalletLayout, measureTextWidth } from './utils';

type Props = {
  walletId: string;
  walletName: string;
  accountName: string;
  isTrueWallet: boolean;
  accountTextRef: React.RefObject<HTMLSpanElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export const useHeaderAccount = ({
  walletId,
  walletName,
  accountName,
  isTrueWallet,
  accountTextRef,
  containerRef,
}: Props) => {
  // Hover state
  const [isWalletHovered, setIsWalletHovered] = useState(false);
  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [isAddressListHovered, setIsAddressListHovered] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);

  // Layout state (calculated from text widths)
  const [showWalletIcon, setShowWalletIcon] = useState(false);
  const [shouldTruncateWallet, setShouldTruncateWallet] = useState(false);
  const [walletMaxWidth, setWalletMaxWidth] = useState<number | undefined>();
  const [isWalletTruncated, setIsWalletTruncated] = useState(false);
  const [isAccountTruncated, setIsAccountTruncated] = useState(false);

  // Tooltip position
  const [tooltipLeftPosition, setTooltipLeftPosition] = useState(0);

  // Balance data
  const { totalBalanceInCurrency, isLoading } = useWalletTotalBalance(walletId);
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
    const accountForBalance = getAccountById(walletId);
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
    walletId,
  ]);

  useEffect(() => {
    const updateLayout = () => {
      // Measure text widths
      const walletNameWidth = measureTextWidth(walletName);
      const accountNameWidth = measureTextWidth(accountName);

      // Calculate wallet display layout
      const layout = calculateWalletLayout(walletNameWidth, accountNameWidth);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletName, walletId, accountName]);

  return {
    isWalletHovered,
    setIsWalletHovered,
    isAccountHovered,
    setIsAccountHovered,
    isAddressListHovered,
    setIsAddressListHovered,
    isContainerHovered,
    setIsContainerHovered,
    showWalletIcon,
    shouldTruncateWallet,
    walletMaxWidth,
    isAccountTruncated,
    tooltipLeftPosition,
    walletTotalBalance,
    isBalanceLoading: isLoading,
    shouldExpandWallet: isWalletHovered && isWalletTruncated,
  };
};
