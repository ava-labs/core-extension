import { getHexAlpha, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { useState } from 'react';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { PersonalAvatar } from '../PersonalAvatar';
import { AddressList } from './AddressList';
import { HeaderActions } from './components/HeaderActions';
import {
  AccountInfo,
  AccountSelectContainer,
} from './components/styledComponents';
import { ConciergePrompt } from './ConciergePrompt';

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();
  const [isAddressAppear, setIsAddressAppear] = useState(false);
  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);
  const history = useHistory();

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
          zIndex: theme.zIndex.tooltip + 1,
        }}
        onMouseEnter={() => {
          setIsAIBackdropOpen(false);
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
      <ConciergePrompt
        isAIBackdropOpen={isAIBackdropOpen}
        setIsAIBackdropOpen={setIsAIBackdropOpen}
      />
    </Stack>
  );
};
