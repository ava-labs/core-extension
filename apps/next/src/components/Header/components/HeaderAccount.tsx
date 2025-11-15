import { styled, Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC, useState, useRef, useEffect } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { HeaderWalletDetails } from '../types';
import { useHistory } from 'react-router-dom';
import { WalletIcon } from '@/components/WalletIcon';

type Props = {
  wallet: HeaderWalletDetails;
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

const WalletSection = styled('div')<{ isHovered: boolean; showIcon: boolean }>(
  ({ theme, isHovered, showIcon }) => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: 'fit-content',
    maxWidth: showIcon ? 'none' : isHovered ? '60%' : '45%',
    flexShrink: 1,
    flexGrow: 0,
    cursor: 'pointer',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible',
    transition: theme.transitions.create(['max-width'], {
      duration: theme.transitions.duration.short,
    }),
  }),
);

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

const TruncatedText = styled(Typography)<{ showFade?: boolean }>(
  ({ theme, showFade }) => ({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'block',
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

const IconWrapper = styled('div')<{ isWalletHovered: boolean }>(
  ({ theme, isWalletHovered }) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    transition: theme.transitions.create(['transform'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }),
    transform: isWalletHovered ? 'translateX(8px)' : 'translateX(0)',
  }),
);

export const HeaderAccount: FC<Props> = ({ wallet, account }) => {
  const history = useHistory();
  const [isWalletHovered, setIsWalletHovered] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [isWalletTruncated, setIsWalletTruncated] = useState(false);
  const [isAccountTruncated, setIsAccountTruncated] = useState(false);
  const walletTextRef = useRef<HTMLSpanElement>(null);
  const accountTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (walletTextRef.current) {
        const isTruncated =
          walletTextRef.current.scrollWidth > walletTextRef.current.clientWidth;
        setIsWalletTruncated(isTruncated);
      }
      if (accountTextRef.current) {
        const isTruncated =
          accountTextRef.current.scrollWidth >
          accountTextRef.current.clientWidth;
        setIsAccountTruncated(isTruncated);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [wallet.name, account?.name]);

  const shouldAnimateArrow = isWalletHovered && isWalletTruncated;
  const showWalletIcon = isAccountTruncated && !!wallet.type;

  return (
    <Container
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      <WalletSection
        isHovered={shouldAnimateArrow}
        showIcon={showWalletIcon}
        onMouseEnter={() => setIsWalletHovered(true)}
        onMouseLeave={() => setIsWalletHovered(false)}
        onClick={() => history.push(`/wallet/${wallet.id}`)}
      >
        {showWalletIcon ? (
          <WalletIcon type={wallet.type!} authProvider={wallet.authProvider} />
        ) : (
          <TruncatedText
            ref={walletTextRef}
            variant="subtitle3"
            showFade={isWalletTruncated}
          >
            {wallet.name}
          </TruncatedText>
        )}
        {isContainerHovered && <Label variant="caption">Wallet</Label>}
      </WalletSection>
      <IconWrapper isWalletHovered={shouldAnimateArrow && isWalletTruncated}>
        <MdNavigateNext />
      </IconWrapper>
      <AccountSection
        shouldShift={shouldAnimateArrow}
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
