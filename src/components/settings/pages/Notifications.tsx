import {
  InfoCircleIcon,
  List,
  ListItem,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
} from '@avalabs/core-k2-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useTranslation } from 'react-i18next';
import { useNotificationsContext } from '@src/contexts/NotificationsProvider';
import { NotificationTypes } from '@src/background/services/notifications/models';

export function Notifications({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { subscriptions, subscribe, unsubscribe } = useNotificationsContext();

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Notifications')}
      />
      <List>
        <ListItem data-testid="balance-notification-option">
          <ListItemText
            sx={{ alignItems: 'center', flex: 'none' }}
            primaryTypographyProps={{ variant: 'body2' }}
          >
            {t('Balance')}
          </ListItemText>
          <Tooltip
            sx={{ ml: 0.5 }}
            PopperProps={{
              sx: {
                maxWidth: '240px',
              },
            }}
            title={t('Wallet balance change alerts')}
          >
            <InfoCircleIcon sx={{ cursor: 'pointer' }} size="16" />
          </Tooltip>
          <Switch
            size="small"
            checked={subscriptions[NotificationTypes.BALANCE_CHANGES]}
            onChange={async () => {
              if (subscriptions[NotificationTypes.BALANCE_CHANGES]) {
                await unsubscribe(NotificationTypes.BALANCE_CHANGES);
              } else {
                await subscribe(NotificationTypes.BALANCE_CHANGES);
              }
            }}
            sx={{
              ml: 'auto',
            }}
          />
        </ListItem>
      </List>
    </Stack>
  );
}
