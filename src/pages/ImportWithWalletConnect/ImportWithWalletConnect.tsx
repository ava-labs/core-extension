import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stack, useTheme } from '@avalabs/k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { WalletConnectCircledIcon } from './components/WalletConnectCircledIcon';
import WalletConnectConnector from './components/WallectConnectConnector';

import { AccountsTab } from '../Accounts/Accounts';

export default function ImportWithWalletConnect() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { goBack, replace } = useHistory();

  const onConnect = useCallback(() => {
    replace(`/accounts?activeTab=${AccountsTab.Imported}`);
  }, [replace]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        background: theme.palette.background.paper,
      }}
    >
      <PageTitle margin="20px 0 4px" onBackClick={goBack}>
        {t('Connect your Wallet')}
      </PageTitle>
      <Stack
        sx={{
          gap: 2.5,
          px: 5,
          mt: 3,
          height: '100%',
          alignItems: 'center',
        }}
      >
        <WalletConnectCircledIcon />
        <WalletConnectConnector onConnect={onConnect} />
      </Stack>
    </Stack>
  );
}
