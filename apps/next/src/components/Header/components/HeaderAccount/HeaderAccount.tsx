import { useState } from 'react';
import { AddressList } from '@/components/AddressList';
import { AccountInfoClickableStack, Container } from './styled';
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
            <PersonalAvatar size="xsmall" mr={1} ml={0.5} />
          </Box>

          <AccountInfoClickableStack
            className="account-info"
            direction="row"
            alignItems="center"
            onClick={() => history.push('/account-management')}
          >
            <PersonalAvatar
              size="xsmall"
              flexShrink={0}
              sx={{ cursor: 'pointer' }}
            />

            <Stack minWidth={0} flex={1} gap={0} overflow="hidden" mx={1}>
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                flexShrink={0}
                minWidth={0}
                overflow="hidden"
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
                  lineHeight={1}
                  minWidth={0}
                  fontWeight="medium"
                >
                  {walletSummary?.name}
                </FadingText>
              </Stack>

              <FadingText
                variant="body2"
                lineHeight={1}
                minWidth={0}
                mt={-0.25}
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
          </AccountInfoClickableStack>
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
