import {
  Stack,
  useTheme,
  getHexAlpha,
  styled,
  Typography,
  SidebarIcon,
  SidebarDockIcon,
  SidebarUndockIcon,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { MdOutlineUnfoldMore, MdQrCode2 } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { AVATAR_OPTIONS, PersonalAvatar } from '../PersonalAvatar';
import { useState } from 'react';
import { StackRow } from '../StackRow';
import { ConnectedSites } from './ConnectedSites';
import { AddressList } from './AddressList';

const AccountInfo = styled(Stack)`
  cursor: pointer;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(0.5)};
  transition: ${({ theme }) =>
    theme.transitions.create(['background', 'opacity'])};

  flex-direction: row;
  align-items: center;
  gap: 1;
  & > svg {
    opacity: 0;
  }
`;

const AccountSelectContainer = styled(Stack)`
  cursor: pointer;
  position: relative;
  &:hover > div:first-of-type {
    background: ${({ theme }) => getHexAlpha(theme.palette.primary.main, 10)};
    & > svg {
      opacity: 1;
    }
  }
`;

// TODO: implement the Icon change logic
const StackRowStyled = styled(StackRow)`
  cursor: pointer;
  & > .sidebarUndockIcon {
    display: none;
  }
  & > .sidebarDockIcon {
    display: none;
  }
  &:hover > .sidebarIcon {
    display: none;
  }
  &:hover > .sidebarDockIcon {
    display: block;
  }
  &:hover > .sidebarUndockIcon {
    display: block;
  }
`;

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();

  const [isAddressAppear, setIsAddressAppear] = useState(false);

  // TODO: implement a getter for the sidebar functionality
  const isSidebar = true;

  return (
    <>
      <Stack
        sx={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: theme.zIndex.appBar,
          borderBottom: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
        }}
      >
        <StackRow
          sx={{
            background: theme.palette.background.default,
            width: '100%',
            height: '56px',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            zIndex: 1,
          }}
        >
          <AccountSelectContainer
            onMouseOver={() => setIsAddressAppear(true)}
            onMouseLeave={() => setIsAddressAppear(false)}
          >
            <AccountInfo>
              <PersonalAvatar
                name={AVATAR_OPTIONS[0]}
                sx={{ display: 'flex', marginRight: 1 }}
                size="xsmall"
              />
              <Typography variant="body1">{activeAccount?.name}</Typography>
              <MdOutlineUnfoldMore
                size={24}
                color={getHexAlpha(theme.palette.primary.main, 70)}
              />
            </AccountInfo>
            <AddressList
              isAddressAppear={isAddressAppear}
              activeAccount={activeAccount}
            />
          </AccountSelectContainer>
          <Stack sx={{ flexDirection: 'row', gap: 1 }}>
            <ConnectedSites activeAccount={activeAccount} />
            <MdQrCode2 size={24} />
            <MdOutlineSettings size={24} />
            <StackRowStyled>
              <SidebarIcon size={24} className="sidebarIcon" />
              {isSidebar && (
                <SidebarUndockIcon size={24} className="sidebarUndockIcon" />
              )}
              {!isSidebar && (
                <SidebarDockIcon size={24} className="sidebarDockIcon" />
              )}
            </StackRowStyled>
          </Stack>
        </StackRow>
      </Stack>
    </>
  );
};
