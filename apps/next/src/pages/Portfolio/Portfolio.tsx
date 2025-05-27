import { Box, Stack, styled } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { FC, useState } from 'react';
import AccountInfo from './components/AccountInfo';
import NavigationBar, { TabName } from './components/NavigationBar';
import OnRampForm from './components/OnRampForm';

const FakeAccountSwitcher = styled(Box)(({ theme }) => ({
  '&:before': {
    content: '"FAKE ACCOUNT SWITCHER (TODO)"',
  },

  height: '56px',
  padding: theme.spacing(1.5),

  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: theme.palette.surface.secondary,
}));

export const Portfolio: FC = () => {
  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>('assets');

  return (
    <Stack height={1} p={1.5}>
      <FakeAccountSwitcher />
      <AccountInfo account={accounts.active!} />
      <OnRampForm />
      <NavigationBar active={activeTab} onChange={setActiveTab} />
    </Stack>
  );
};
