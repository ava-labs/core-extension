import {
  Box,
  Button,
  getHexAlpha,
  keyframes,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import { PersonalAvatar } from '../PersonalAvatar';
import { AddressList } from './AddressList';
import { HeaderActions } from './components/HeaderActions';
import { useTranslation } from 'react-i18next';

const AccountInfo = styled(Stack)`
  cursor: pointer;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(0.5)};
  transition: ${({ theme }) =>
    theme.transitions.create(['background', 'opacity'])};
  flex-direction: row;
  align-items: center;
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

const promptTextAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(25%, 0px, 0px);
  }
  20% {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px);
  }
  80% {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px);
  }
  100% {
    opacity: 0;
    transform: translate3d(25%, 0px, 0px);
  }
`;
const TextAnimation = styled('span')`
  animation: 6000ms ease 0s infinite normal none running ${promptTextAnimation};
`;

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();
  const [isAddressAppear, setIsAddressAppear] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  console.log('location: ', location);

  const [index, setIndex] = useState(0);
  const buttonLabels = useMemo(() => {
    return [
      t('Core Concierge - Manage your wallet'),
      t('Core Concierge pick up where you left off'),
      t('Ask Core to transfer funds'),
    ].sort(() => 0.5 - Math.random());
  }, [t]);
  useEffect(() => {
    const getNextLabel = () =>
      setIndex((i) => {
        if (i >= buttonLabels.length - 1) {
          return 0;
        }
        return i + 1;
      });
    const id = setInterval(getNextLabel, 6000);
    return () => clearInterval(id);
  }, [buttonLabels.length]);

  // TODO: fix this after the transactions will be implemented
  // TODO: fix the icon in k2 dark mode.....
  // the true will rotate
  const isTransactionPending = false;

  return (
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
      <Stack
        direction="row"
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
          onClick={() => history.push('/account-management')}
        >
          <AccountInfo>
            <PersonalAvatar cached size="xsmall" sx={{ mr: 1 }} />
            <Typography variant="body2">{activeAccount?.name}</Typography>
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
        <HeaderActions
          activeAccount={activeAccount}
          pendingTransaction={isTransactionPending}
        />
      </Stack>
      <Stack
        sx={{
          position: 'absolute',
          top: '60px',
          zIndex: theme.zIndex.appBar + 1,
          maxWidth: '100%',
        }}
      >
        <Button
          color="primary"
          variant="contained"
          sx={{ maxWidth: '100%' }}
          onClick={() => {
            console.log('hello');
            history.push('/concierge');
          }}
        >
          <Box component="span" sx={{ mr: 1, fontSize: 24 }}>
            ✨
          </Box>
          <TextAnimation>{buttonLabels[index]}</TextAnimation>
        </Button>
      </Stack>
    </Stack>
  );
};
