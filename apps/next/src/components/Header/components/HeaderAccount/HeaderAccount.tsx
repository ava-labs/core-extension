import { Account } from '@core/types';
import { FC, useRef } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { HeaderWalletDetails } from '../../types';
import { WalletTotalBalanceProvider } from '@core/ui';
import { AddressList } from '../../AddressList';
import { useHeaderAccount } from './hooks/useHeaderAccount';
import { WalletSection } from './components/WalletSection';
import { Container, IconWrapper } from './styled';
import { AccountSection } from './components/AccountSection';
import { TokenSection } from './components/TokenSection';

type Props = {
  wallet: HeaderWalletDetails;
  isTrueWallet: boolean;
  account?: Account;
  tokenName?: string;
};

const HeaderAccountContent: FC<Props> = ({
  wallet,
  isTrueWallet,
  account,
  tokenName,
}) => {
  // DOM refs for measuring
  const walletTextRef = useRef<HTMLSpanElement>(null);
  const accountTextRef = useRef<HTMLSpanElement>(null);
  const tokenTextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
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
    isBalanceLoading,
    shouldExpandWallet,
  } = useHeaderAccount({
    walletId: wallet.id,
    walletName: wallet.name,
    accountName: account?.name || '',
    isTrueWallet,
    accountTextRef,
    containerRef,
  });

  // When tokenName is present, force wallet to show as icon
  const shouldShowWalletIcon = tokenName ? true : showWalletIcon;

  return (
    <Container
      ref={containerRef}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      {/* Wallet Name or Icon */}
      <WalletSection
        showWalletIcon={shouldShowWalletIcon}
        shouldTruncateWallet={shouldTruncateWallet}
        walletMaxWidth={walletMaxWidth}
        shouldExpandWallet={shouldExpandWallet}
        setIsWalletHovered={setIsWalletHovered}
        isWalletHovered={isWalletHovered}
        tooltipLeftPosition={tooltipLeftPosition}
        isBalanceLoading={isBalanceLoading}
        walletTotalBalance={walletTotalBalance}
        wallet={wallet}
        walletTextRef={walletTextRef}
        isContainerHovered={isContainerHovered}
      />

      {/* Navigation Arrow */}
      <IconWrapper shouldShift={false}>
        <MdNavigateNext />
      </IconWrapper>

      {/* Account Name */}
      <AccountSection
        setIsAccountHovered={setIsAccountHovered}
        accountTextRef={accountTextRef}
        isAccountTruncated={isAccountTruncated}
        accountName={account?.name || ''}
        isContainerHovered={isContainerHovered}
      />

      {/* Token Name (if present) */}
      {tokenName && (
        <>
          {/* Navigation Arrow */}
          <IconWrapper shouldShift={false}>
            <MdNavigateNext />
          </IconWrapper>

          {/* Token Name */}
          <TokenSection
            tokenTextRef={tokenTextRef}
            isTokenTruncated={false}
            tokenName={tokenName}
            isContainerHovered={isContainerHovered}
          />
        </>
      )}

      <AddressList
        isAddressAppear={isAccountHovered || isAddressListHovered}
        activeAccount={account}
        onMouseEnter={() => setIsAddressListHovered(true)}
        onMouseLeave={() => setIsAddressListHovered(false)}
      />
    </Container>
  );
};

export const HeaderAccount: FC<Props> = ({
  wallet,
  isTrueWallet,
  account,
  tokenName,
}) => {
  return (
    <WalletTotalBalanceProvider>
      <HeaderAccountContent
        wallet={wallet}
        isTrueWallet={isTrueWallet}
        account={account}
        tokenName={tokenName}
      />
    </WalletTotalBalanceProvider>
  );
};
