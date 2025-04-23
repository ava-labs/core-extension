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
import {
  BalanceNotificationTypes,
  NewsNotificationTypes,
  NotificationTypes,
} from '@src/background/services/notifications/models';
import { useCallback, useEffect, useState } from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function Notifications({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { subscriptions, syncSubscriptions, subscribe, unsubscribe } =
    useNotificationsContext();
  const { capture } = useAnalyticsContext();
  const [isLoading, setIsLoading] = useState(false);

  const NOTIFICATION_TYPE_DETAILS = {
    [BalanceNotificationTypes.BALANCE_CHANGES]: {
      title: t('Balance'),
      description: t('Wallet balance change alerts'),
    },
    [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: {
      title: t('Product Announcements'),
      description: t('Learn about new features and changes'),
    },
    [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: {
      title: t('Offers and Promotions'),
      description: t('Airdrops and promotional offers'),
    },
    [NewsNotificationTypes.MARKET_NEWS]: {
      title: t('Market News'),
      description: t('News and market information alerts'),
    },
    [NewsNotificationTypes.PRICE_ALERTS]: {
      title: t('Price Alerts'),
      description: t('Price alerts for your favorite tokens'),
    },
  };

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

      capture('NotificationSettingsUpdated', {
        type: notificationType,
        enabled: isChecked,
      });
    },
    [capture, subscribe, t, unsubscribe],
  );

  useEffect(() => {
    syncSubscriptions();
  }, [syncSubscriptions]);

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
        {Object.entries(NOTIFICATION_TYPE_DETAILS).map(([type, details]) => (
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
                // optimistic update, will be corrected after the subscription is confirmed or rejected
                subscriptions[type] = isChecked;
                handleSubscriptionChange(type as NotificationTypes, isChecked);
              }}
              disabled={isLoading}
              sx={{
                ml: 'auto',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              data-testid={`notification-toggle-${type}`}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
