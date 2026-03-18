import { MdNotificationsNone } from 'react-icons/md';
import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { Box, IconButton, Stack, Tooltip, useTheme } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { ConnectedSites } from '../../ConnectedSites';
import { ViewModeSwitcher } from '../../ViewModeSwitcher';
import { useTranslation } from 'react-i18next';
import { useNotificationsButtonState } from './hooks/useNotificationsButtonState';

const ICON_BUTTON_SIZE = 'small' as const;

type Props = {
  account: Account | undefined;
};

export const HeaderActions: FC<Props> = ({ account }) => {
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();
  const { showActiveIcon, showUnreadBadge } = useNotificationsButtonState();

  return (
    <Stack direction="row" alignItems="center">
      <ConnectedSites activeAccount={account} />
      <Tooltip title={t('Settings')}>
        <IconButton
          disableRipple={true}
          data-testid="settings-button"
          onClick={() => history.push('/settings')}
          size={ICON_BUTTON_SIZE}
          sx={{ color: theme.palette.text.primary }}
        >
          <FiSettings size={20} style={{ scale: 5 / 6 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Notifications')}>
        <IconButton
          disableRipple
          size={ICON_BUTTON_SIZE}
          data-testid="notifications-button"
          onClick={() => history.push('/notifications')}
          sx={{ color: theme.palette.text.primary, position: 'relative' }}
        >
          {showActiveIcon ? (
            <AnimatedSyncIcon size={20} data-active={true} />
          ) : (
            <MdNotificationsNone size={20} />
          )}
          {showUnreadBadge && (
            <Box
              position="absolute"
              top={4}
              right={4}
              bgcolor="error.main"
              borderRadius="50%"
              width={6}
              height={6}
            />
          )}
        </IconButton>
      </Tooltip>
      <ViewModeSwitcher />
    </Stack>
  );
};
