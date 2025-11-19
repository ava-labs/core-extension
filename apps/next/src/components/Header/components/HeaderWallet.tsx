import { PersonalAvatar } from '@/components/PersonalAvatar';
import { FC, useEffect, useRef, useState } from 'react';
import { HeaderWalletDetails } from '../types';
import { useHistory } from 'react-router-dom';
import { styled, Typography } from '@avalabs/k2-alpine';

type Props = {
  wallet: HeaderWalletDetails;
};

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  width: '128px',
  minWidth: 0,
  overflow: 'visible',
}));

const WalletNameContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  width: 'fit-content',
  maxWidth: '100%',
  flexShrink: 1,
  flexGrow: 0,
  cursor: 'pointer',
  position: 'relative',
  justifyContent: 'center',
  overflow: 'visible',
});

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

export const HeaderWallet: FC<Props> = ({ wallet }) => {
  const history = useHistory();
  const [isWalletTruncated, setIsWalletTruncated] = useState(false);
  const walletTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (walletTextRef.current) {
        const isTruncated =
          walletTextRef.current.scrollWidth > walletTextRef.current.clientWidth;
        setIsWalletTruncated(isTruncated);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [wallet.name]);

  return (
    <Container>
      <PersonalAvatar cached size="xsmall" />
      <WalletNameContainer onClick={() => history.push('/account-management')}>
        <TruncatedText
          ref={walletTextRef}
          variant="subtitle3"
          showFade={isWalletTruncated}
        >
          {wallet.name}
        </TruncatedText>
      </WalletNameContainer>
    </Container>
  );
};
