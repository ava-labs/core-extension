import {
  InfoCircleIcon,
  List,
  ListItem,
  ListItemText,
  Stack,
  Switch,
  toast,
  Tooltip,
} from '@avalabs/core-k2-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useTranslation } from 'react-i18next';
import { useNotificationsContext } from '@src/contexts/NotificationsProvider';
import { NotificationTypes } from '@src/background/services/notifications/models';
import { useCallback, useState } from 'react';

const NOTIFICATION_TYPE_DETAILS = {
  [NotificationTypes.BALANCE_CHANGES]: {
    title: 'Balance',
    description: 'Wallet balance change alerts',
  },
  [NotificationTypes.PRICE_ALERTS]: {
    title: 'Price Alerts',
    description: 'Price alerts for your favorite tokens',
  },
};

export function Notifications({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { subscriptions, subscribe, unsubscribe } = useNotificationsContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscriptionChange = useCallback(
    async (notificationType: NotificationTypes, isChecked: boolean) => {
      const handler = async () => {
        if (isChecked) {
          await subscribe(notificationType);
        } else {
          await unsubscribe(notificationType);
        }
      };
      setIsLoading(true);

      handler()
        .catch(() => toast.error(t('Failed to update notification settings')))
        .finally(() => setIsLoading(false));
    },
    [subscribe, t, unsubscribe],
  );

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
        {Object.entries(NOTIFICATION_TYPE_DETAILS).map(
          ([type, details]) =>
            subscriptions[type] !== undefined && (
              <ListItem data-testid={`notification-option-${type}`} key={type}>
                <ListItemText
                  sx={{ alignItems: 'center', flex: 'none' }}
                  primaryTypographyProps={{ variant: 'body2' }}
                >
                  {details.title}
                </ListItemText>
                <Tooltip
                  sx={{ ml: 0.5 }}
                  PopperProps={{
                    sx: {
                      maxWidth: '240px',
                    },
                  }}
                  title={t(details.description)}
                >
                  <InfoCircleIcon sx={{ cursor: 'pointer' }} size="16" />
                </Tooltip>
                <Switch
                  size="small"
                  checked={subscriptions[type]}
                  onChange={(_, isChecked) => {
                    subscriptions[type] = isChecked;
                    handleSubscriptionChange(
                      type as NotificationTypes,
                      isChecked,
                    );
                  }}
                  disabled={isLoading}
                  sx={{
                    ml: 'auto',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                />
              </ListItem>
            ),
        )}
      </List>
    </Stack>
  );
}
