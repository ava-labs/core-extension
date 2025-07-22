import {
  Stack,
  useTheme,
  getHexAlpha,
  styled,
  Typography,
  SyncIcon,
  keyframes,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { MdOutlineUnfoldMore, MdQrCode2 } from 'react-icons/md';
import { MdOutlineSettings } from 'react-icons/md';
import { PersonalAvatar } from '../PersonalAvatar';
import { useState } from 'react';
import { StackRow } from '../StackRow';
import { ConnectedSites } from './ConnectedSites';
import { AddressList } from './AddressList';
import { ViewModeSwitcher } from './ViewModeSwitcher';

const rotate = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

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

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();

  const [isAddressAppear, setIsAddressAppear] = useState(false);

  // TODO: fix this after the transactions will be implemented
  // TODO: fix the icon in k2 dark mode.....
  // the true will rotate
  const isTransactionPending = false;

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
                cached
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
            <SyncIcon
              size={24}
              sx={{
                animation: `${isTransactionPending ? rotate : 'none'} 2s linear infinite;`,
                width: '24px',
                height: '24px',
              }}
            />
            <ViewModeSwitcher />
          </Stack>
        </StackRow>
      </Stack>
    </>
  );
};
