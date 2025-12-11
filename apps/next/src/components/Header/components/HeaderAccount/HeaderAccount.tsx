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

const AVATAR_ONLY_CLASS = 'avatar-only';
const ACCOUNT_INFO_CLASS = 'account-info';
const ADDRESS_LIST_CLASS = 'address-list';

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

  const hasAccountData = walletSummary && account;
  const showAccountInfoByDefault = isAccountView
    ? !!(hasAccountData && !isAccountInfoVisible)
    : false;

  return (
    <Container
      showAccountInfoByDefault={showAccountInfoByDefault}
      avatarOnlyClass={AVATAR_ONLY_CLASS}
      accountInfoClass={ACCOUNT_INFO_CLASS}
      addressListClass={ADDRESS_LIST_CLASS}
    >
      {hasAccountData && (
        <Box position="relative" minWidth={0} overflow="visible">
          <Box className={AVATAR_ONLY_CLASS} sx={{ cursor: 'pointer' }}>
            <PersonalAvatar size="xsmall" mr={1} ml={0.5} />
          </Box>

          <AccountInfoClickableStack
            className={ACCOUNT_INFO_CLASS}
            direction="row"
            alignItems="center"
            onClick={() => history.push('/account-management')}
          >
            <PersonalAvatar
              size="xsmall"
              flexShrink={0}
              sx={{ cursor: 'pointer' }}
            />

            <Stack
              minWidth={0}
              flex={1}
              gap={0}
              sx={{ overflowX: 'hidden' }}
              mx={1}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                flexShrink={0}
                minWidth={0}
                sx={{ overflowX: 'hidden' }}
              >
                <Box sx={{ flexShrink: 0 }}>
                  <WalletIcon
                    size={16}
                    type={walletSummary?.type}
                    authProvider={walletSummary?.authProvider}
                    color={theme.palette.text.secondary}
                    expanded
                  />
                </Box>
                <FadingText
                  variant="caption2"
                  color="text.secondary"
                  lineHeight={1.2}
                  minWidth={0}
                  fontWeight="medium"
                >
                  {walletSummary?.name}
                </FadingText>
              </Stack>

              <FadingText
                variant="body2"
                lineHeight={1.2}
                minWidth={0}
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
        className={ADDRESS_LIST_CLASS}
        activeAccount={account}
        top={56}
      />
    </Container>
  );
};
