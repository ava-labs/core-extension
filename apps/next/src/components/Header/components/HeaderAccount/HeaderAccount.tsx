import { FC, useEffect, useRef, useState } from 'react';
import { WalletTotalBalanceProvider } from '@core/ui';
import { AddressList } from '@/components/AddressList';
import { Container } from './styled';
import { PersonalAvatar } from '@/components/PersonalAvatar';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletIcon } from '@/components/WalletIcon';
import { Stack, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { FadingText } from '../FadingText';

type Props = {
  isAccountInfoVisible: boolean;
};

const HeaderAccountContent: FC<Props> = ({ isAccountInfoVisible }) => {
  const theme = useTheme();
  const history = useHistory();
  const { walletSummary, account } = useActiveAccountInfo();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isAccountHovered, setIsAccountHovered] = useState(false);
  const [isAddressListHovered, setIsAddressListHovered] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false);

  // Delay enabling hover to prevent flash when navigating back
  useEffect(() => {
    const timer = setTimeout(() => setHoverEnabled(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container ref={containerRef}>
      {isAccountInfoVisible && (
        <PersonalAvatar size="xsmall" sx={{ mr: 1, ml: 0.5 }} />
      )}

      {walletSummary && account && !isAccountInfoVisible && (
        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          sx={{
            p: 0.5,
            backgroundColor: 'background.navBarItem',
            borderRadius: 1,
            my: 0.5,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
          onClick={() => {
            setIsAccountHovered(false);
            setIsAddressListHovered(false);
            history.push('/account-management');
          }}
          onMouseEnter={() => hoverEnabled && setIsAccountHovered(true)}
          onMouseLeave={() => setIsAccountHovered(false)}
        >
          <PersonalAvatar size="xsmall" sx={{ mr: 1, flexShrink: 0 }} />

          <Stack sx={{ minWidth: 0, flex: 1, gap: 0 }}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <div style={{ flexShrink: 0 }}>
                <WalletIcon
                  size={16}
                  type={walletSummary.type}
                  authProvider={walletSummary.authProvider}
                  color={theme.palette.text.secondary}
                  expanded={true}
                />
              </div>
              <FadingText
                variant="caption2"
                color="text.secondary"
                sx={{ lineHeight: 1 }}
                fontWeight="medium"
              >
                {walletSummary.name}
              </FadingText>
            </Stack>

            <FadingText
              variant="body2"
              sx={{ lineHeight: 1, mt: -0.25 }}
              color="text.primary"
            >
              {account?.name}
            </FadingText>
          </Stack>
          <MdUnfoldMore
            size={16}
            color={theme.palette.text.secondary}
            style={{ flexShrink: 0 }}
          />
        </Stack>
      )}

      <AddressList
        isAddressAppear={isAccountHovered || isAddressListHovered}
        activeAccount={account}
        onMouseEnter={() => hoverEnabled && setIsAddressListHovered(true)}
        onMouseLeave={() => setIsAddressListHovered(false)}
        top={56}
      />
    </Container>
  );
};

export const HeaderAccount: FC<Props> = ({ isAccountInfoVisible }) => {
  return (
    <WalletTotalBalanceProvider>
      <HeaderAccountContent isAccountInfoVisible={isAccountInfoVisible} />
    </WalletTotalBalanceProvider>
  );
};
