import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stack, useTheme } from '@avalabs/core-k2-components';

import { PageTitle } from 'packages/ui/src/components/common/PageTitle';
import { WalletConnectCircledIcon } from './components/WalletConnectCircledIcon';
import WalletConnectConnector from './components/WalletConnectConnector';

import { OnConnectCallback } from '@src/contexts/WalletConnectContextProvider/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

type ImportWithWalletConnectProps = {
  onConnect?: OnConnectCallback;
  appIcon?: React.ReactElement;
};

export default function ImportWithWalletConnect({
  onConnect,
  appIcon,
}: ImportWithWalletConnectProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { goBack, replace } = useHistory();
  const { capture } = useAnalyticsContext();

  const handleSuccessfulConnection: OnConnectCallback = useCallback(
    (result) => {
      if (typeof onConnect === 'function') {
        onConnect(result);
      } else {
        capture('ImportWithWalletConnect_Success');
        replace('/accounts');
      }
    },
    [replace, onConnect, capture],
  );

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
        {appIcon ?? <WalletConnectCircledIcon />}
        <WalletConnectConnector onConnect={handleSuccessfulConnection} />
      </Stack>
    </Stack>
  );
}
