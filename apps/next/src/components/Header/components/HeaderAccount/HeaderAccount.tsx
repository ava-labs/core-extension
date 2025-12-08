import { FC, useState } from 'react';
import { AddressList } from '@/components/AddressList';
import { Container } from './styled';
import { PersonalAvatar } from '@/components/PersonalAvatar';
import { useActiveAccountInfo } from '@/hooks/useActiveAccountInfo';
import { WalletIcon } from '@/components/WalletIcon';
import { Box, Stack, useTheme } from '@avalabs/k2-alpine';
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

  const [isContainerHovered, setIsContainerHovered] = useState(false);

  const hasAccountData = walletSummary && account;
  const showAccountInfoByDefault = hasAccountData && !isAccountInfoVisible;

  return (
    <Container
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
      sx={{
        // Avatar: visible by default when isAccountInfoVisible, hidden on container hover
        '& .avatar-only': {
          display: showAccountInfoByDefault ? 'none' : 'block',
        },
        // Account info: hidden by default when isAccountInfoVisible, visible on container hover
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
        <Box sx={{ position: 'relative' }}>
          <Box className="avatar-only" sx={{ cursor: 'pointer' }}>
            <PersonalAvatar size="xsmall" sx={{ mr: 1, ml: 0.5 }} />
          </Box>

          <Stack
            className="account-info"
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
              cursor: 'pointer',
            }}
            onClick={() => history.push('/account-management')}
          >
            <PersonalAvatar
              size="xsmall"
              sx={{ mr: 1, flexShrink: 0, cursor: 'pointer' }}
            />

            <Stack sx={{ minWidth: 0, flex: 1, gap: 0 }}>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <div style={{ flexShrink: 0 }}>
                  <WalletIcon
                    size={16}
                    type={walletSummary?.type}
                    authProvider={walletSummary?.authProvider}
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
                  {walletSummary?.name}
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

export const HeaderAccount: FC<Props> = ({ isAccountInfoVisible }) => {
  return <HeaderAccountContent isAccountInfoVisible={isAccountInfoVisible} />;
};
