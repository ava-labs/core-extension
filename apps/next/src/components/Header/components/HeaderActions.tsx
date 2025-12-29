import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import {
  IconButton,
  QrCodeIcon,
  Stack,
  Tooltip,
  useTheme,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';
import { useAnalyticsContext } from '@core/ui';
import { ConnectedSites } from '../ConnectedSites';
import { ViewModeSwitcher } from '../ViewModeSwitcher';
import { useTranslation } from 'react-i18next';

type Props = {
  account: Account | undefined;
};

export const HeaderActions: FC<Props> = ({ account }) => {
  const history = useHistory();
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const location = useLocation();
  const {
    state: { pendingTransfers },
  } = useNextUnifiedBridgeContext();
  const hasPendingTransactions = Object.values(pendingTransfers).length > 0;

  const isWalletView = location.pathname.startsWith('/wallet');

  return (
    <Stack direction="row" alignItems="center">
      <ConnectedSites activeAccount={account} />
      {!isWalletView && (
        <Tooltip title={t('Receive crypto')}>
          <IconButton
            disableRipple={true}
            disabled={!account}
            size="small"
            onClick={() => {
              capture('TokenReceiveClicked', { addressType: 'C' });
              history.push(`/receive?accId=${account?.id}`);
            }}
          >
            <QrCodeIcon fill={theme.palette.text.primary} size={24} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={t('Settings')}>
        <IconButton
          disableRipple={true}
          data-testid="settings-button"
          onClick={() => history.push('/settings')}
          size="small"
          sx={{ color: theme.palette.text.primary }}
        >
          <FiSettings size={20} style={{ scale: 5 / 6 }} />
        </IconButton>
      </Tooltip>
      <IconButton
        disableRipple={true}
        size="small"
        onClick={() => history.push('/activity')}
      >
        <AnimatedSyncIcon
          size={24}
          data-active={hasPendingTransactions}
          data-hidden={!hasPendingTransactions}
        />
      </IconButton>
      <ViewModeSwitcher />
    </Stack>
  );
};
