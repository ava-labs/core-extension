import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import { IconButton, QrCodeIcon, Stack, useTheme } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { ConnectedSites } from '../ConnectedSites';
import { ViewModeSwitcher } from '../ViewModeSwitcher';

type Props = {
  account: Account | undefined;
};

export const HeaderActions: FC<Props> = ({ account }) => {
  const history = useHistory();
  const theme = useTheme();
  const {
    state: { pendingTransfers },
  } = useNextUnifiedBridgeContext();
  const hasPendingTransactions = Object.values(pendingTransfers).length > 0;

  return (
    <Stack direction="row" alignItems="center">
      <ConnectedSites activeAccount={account} />
      <IconButton
        disabled={!account}
        size="small"
        onClick={() => history.push(`/receive?accId=${account?.id}`)}
      >
        <QrCodeIcon fill={theme.palette.text.primary} size={24} />
      </IconButton>
      <IconButton onClick={() => history.push('/settings')} size="small">
        <FiSettings size={24} style={{ scale: 5 / 6 }} />
      </IconButton>
      <IconButton size="small" onClick={() => history.push('/activity')}>
        <AnimatedSyncIcon size={24} data-active={hasPendingTransactions} />
      </IconButton>
      <ViewModeSwitcher />
    </Stack>
  );
};
