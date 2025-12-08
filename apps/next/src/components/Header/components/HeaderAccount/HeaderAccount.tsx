import { useState } from 'react';
import { AddressList } from '@/components/AddressList';
import { Container } from './styled';
import { PersonalAvatar } from '@/components/PersonalAvatar';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletIcon } from '@/components/WalletIcon';
import { Box, Stack, useTheme } from '@avalabs/k2-alpine';
import { MdUnfoldMore } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import { FadingText } from '../FadingText';
import { useAccountInfoVisibility } from '@/contexts/AccountInfoVisibilityContext';

/**
 * This component is used to display the header account information.
 * When the user is on the wallet view, the personal avatar is displayed by default. And when the user hovers over the container, the account information is displayed.
 * When the user is on the account view, it will behave the same way as wallet view. But when the user scroll down far enough and account information is not visible, then the account info is displayed.
 **/

export const HeaderAccount = () => {
  const { isAccountInfoVisible } = useAccountInfoVisibility();

  const location = useLocation();
  const isAccountView =
    location.pathname === '/' ||
    location.pathname === '/portfolio' ||
    location.pathname === '/home';

  const theme = useTheme();
  const history = useHistory();
  const { walletSummary, account } = useActiveAccountInfo();

  const [isContainerHovered, setIsContainerHovered] = useState(false);

  const hasAccountData = walletSummary && account;
  const showAccountInfoByDefault = isAccountView
    ? hasAccountData && !isAccountInfoVisible
    : false;

  return (
    <Container
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
      sx={{
        '& .avatar-only': {
          display: showAccountInfoByDefault ? 'none' : 'block',
        },
        '& .account-info': {
          display: showAccountInfoByDefault ? 'flex' : 'none',
        },
        '&:hover .avatar-only': {
          display: 'none',
        },
        '&:hover .account-info': {
          display: 'flex',
        },
      }}
    >
      {hasAccountData && (
        <Box position="relative" minWidth={0} overflow="hidden">
          <Box className="avatar-only" sx={{ cursor: 'pointer' }}>
            <PersonalAvatar size="xsmall" sx={{ mr: 1, ml: 0.5 }} />
          </Box>

          <Stack
            className="account-info"
            direction="row"
            alignItems="center"
            onClick={() => history.push('/account-management')}
            sx={{
              p: 0.5,
              borderRadius: 1,
              backgroundColor: 'background.navBarItem',
              my: 0.5,
              cursor: 'pointer',
            }}
          >
            <PersonalAvatar
              size="xsmall"
              sx={{ flexShrink: 0, cursor: 'pointer' }}
            />

            <Stack
              sx={{ minWidth: 0, flex: 1, gap: 0, overflow: 'hidden', mx: 1 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                sx={{ minWidth: 0, overflow: 'hidden' }}
              >
                <Box sx={{ flexShrink: 0 }}>
                  <WalletIcon
                    size={16}
                    type={walletSummary?.type}
                    authProvider={walletSummary?.authProvider}
                    color={theme.palette.text.secondary}
                    expanded={true}
                  />
                </Box>
                <FadingText
                  variant="caption2"
                  color="text.secondary"
                  sx={{ lineHeight: 1, minWidth: 0 }}
                  fontWeight="medium"
                >
                  {walletSummary?.name}
                </FadingText>
              </Stack>

              <FadingText
                variant="body2"
                sx={{ lineHeight: 1, mt: -0.25, minWidth: 0 }}
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
        </Box>
      )}

      <AddressList
        isAddressAppear={isContainerHovered}
        activeAccount={account}
        top={56}
      />
    </Container>
  );
};
