import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { Stack, styled, Switch, Typography } from '@avalabs/k2-alpine';

import {
  BalanceNotificationTypes,
  NewsNotificationTypes,
  NotificationTypes,
} from '@core/types';
import { toast, useAnalyticsContext, useNotificationsContext } from '@core/ui';

import { Page } from '@/components/Page';
import { Card } from '@/components/Card';

type NotificationDetail = {
  type: NotificationTypes;
  title: string;
  description: string;
};

export const NotificationPreferences = () => {
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { subscriptions, subscribe, unsubscribe } = useNotificationsContext();
  const { capture } = useAnalyticsContext();
  const [isUpdatingByType, setIsUpdatingByType] = useState<
    Record<NotificationTypes, boolean>
  >({
    [BalanceNotificationTypes.BALANCE_CHANGES]: false,
    [NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS]: false,
    [NewsNotificationTypes.OFFERS_AND_PROMOTIONS]: false,
    [NewsNotificationTypes.MARKET_NEWS]: false,
    [NewsNotificationTypes.PRICE_ALERTS]: false,
  });

  const notificationDetails: NotificationDetail[] = useMemo(
    () => [
      {
        type: BalanceNotificationTypes.BALANCE_CHANGES,
        title: t('Balance'),
        description: t('Wallet balance change alerts'),
      },
      {
        type: NewsNotificationTypes.PRODUCT_ANNOUNCEMENTS,
        title: t('Product announcements'),
        description: t('Learn about new features and changes'),
      },
      {
        type: NewsNotificationTypes.OFFERS_AND_PROMOTIONS,
        title: t('Special offers and promotions'),
        description: t('Airdrops and promotional offers'),
      },
      {
        type: NewsNotificationTypes.MARKET_NEWS,
        title: t('Market news'),
        description: t('News and market information alerts'),
      },
      {
        type: NewsNotificationTypes.PRICE_ALERTS,
        title: t('Price alerts'),
        description: t('Token price movement alerts'),
      },
    ],
    [t],
  );

  const handleToggle = useCallback(
    async (notificationType: NotificationTypes, isChecked: boolean) => {
      setIsUpdatingByType((prev) => ({
        ...prev,
        [notificationType]: true,
      }));

      const handler = isChecked ? subscribe : unsubscribe;

      try {
        await handler(notificationType);
        capture('NotificationSettingsUpdated', {
          type: notificationType,
          enabled: isChecked,
        });
      } catch {
        toast.error(t('Failed to update notification settings'));
        capture('NotificationSettingsUpdateFailed', {
          type: notificationType,
          attemptedTo: isChecked ? 'enable' : 'disable',
        });
      } finally {
        setIsUpdatingByType((prev) => ({
          ...prev,
          [notificationType]: false,
        }));
      }
    },
    [capture, subscribe, unsubscribe, t],
  );

  return (
    <Page
      title={t('Notification preferences')}
      withBackButton
      onBack={goBack}
      contentProps={{ gap: 1, justifyContent: 'start' }}
    >
      {notificationDetails.map(({ type, title, description }) => (
        <PreferenceCard key={type}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack>
              <Typography variant="body3" color="text.primary">
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            </Stack>
            <Switch
              size="small"
              checked={subscriptions[type] ?? false}
              onChange={(_, isChecked) => {
                handleToggle(type, isChecked);
              }}
              disabled={isUpdatingByType[type]}
            />
          </Stack>
        </PreferenceCard>
      ))}
    </Page>
  );
};

const PreferenceCard = styled(Card)(({ theme }) => ({
  width: '100%',
  paddingBlock: theme.spacing(0.75),
  paddingInline: theme.spacing(2),
}));
