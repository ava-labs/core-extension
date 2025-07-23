import { Stack } from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { FC, useState } from 'react';
import AccountInfo from './components/AccountInfo';
import NavigationBar, { TabName } from './components/NavigationBar';
import OnRampForm from './components/OnRampForm/OnRampForm';

export const Portfolio: FC = () => {
  const { accounts } = useAccountsContext();
  const [activeTab, setActiveTab] = useState<TabName>('assets');

  return (
    <Stack height={1} px={1.5} pb={1.5} gap={2.5}>
      <AccountInfo account={accounts.active!} />
      <OnRampForm />
      <NavigationBar active={activeTab} onChange={setActiveTab} />
    </Stack>
  );
};
