import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Skeleton,
  Stack,
  StackProps,
  alpha,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import {
  AppNotification,
  NotificationTab,
  isPriceAlertNotification,
  isBalanceChangeNotification,
} from '@core/types';

import { Page } from '@/components/Page';
import { Tab, TabMenu } from '@/components/TabMenu';

import {
  useNotifications,
  useUnreadCount,
  useClearAll,
} from './hooks/useNotificationCenter';
import { NotificationEmptyState } from './components/NotificationEmptyState';
import { PriceAlertItem } from './components/PriceAlertItem';
import { BalanceChangeItem } from './components/BalanceChangeItem';
import { GenericNotificationItem } from './components/GenericNotificationItem';

const TAB_ITEMS = [
  { label: 'All', value: NotificationTab.ALL },
  { label: 'Transactions', value: NotificationTab.TRANSACTIONS },
  { label: 'Prices', value: NotificationTab.PRICE_UPDATES },
] as const;

const contentProps: StackProps = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: 1,
  gap: 0,
  pb: 9,
};

const isPriceAlertWithData = (notification: AppNotification): boolean => {
  if (!isPriceAlertNotification(notification)) return false;
  return notification.data?.priceChangePercent !== undefined;
};

const isBalanceChangeWithData = (notification: AppNotification): boolean => {
  if (!isBalanceChangeNotification(notification)) return false;
  const { transfers } = notification.data ?? {};
  return transfers !== undefined && transfers.length > 0;
};

const hasActionableUrl = (notification: AppNotification): boolean => {
  const url = notification.deepLinkUrl;
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.replace(':', '');
    return !(protocol === 'core' && parsedUrl.host === 'portfolio');
  } catch {
    return false;
  }
};

const renderNotificationItem = (
  item: AppNotification,
  props: {
    showSeparator: boolean;
    accessoryType: 'chevron' | 'none';
    onClick?: () => void;
  },
) => {
  if (isPriceAlertWithData(item)) {
    return <PriceAlertItem notification={item} {...props} />;
  }

  if (isBalanceChangeWithData(item)) {
    return <BalanceChangeItem notification={item} {...props} />;
  }

  return <GenericNotificationItem notification={item} {...props} />;
};

export const Notifications = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const selectedTab = TAB_ITEMS[selectedTabIndex]?.value ?? NotificationTab.ALL;
  const { notifications, isLoading } = useNotifications(selectedTab);
  const totalUnreadCount = useUnreadCount();
  const { clearAll, isClearing } = useClearAll();

  const hasNoNotificationsAtAll = totalUnreadCount === 0;
  const isCurrentTabEmpty =
    notifications.length === 0 && !isClearing && !isLoading;
  const showFullEmptyState = isCurrentTabEmpty && hasNoNotificationsAtAll;
  const showFilteredEmptyState = isCurrentTabEmpty && !hasNoNotificationsAtAll;

  const handleNotificationPress = useCallback(
    (notification: AppNotification) => {
      const url = notification.deepLinkUrl;
      if (url && hasActionableUrl(notification)) {
        window.open(url, '_blank');
      }
    },
    [],
  );

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setSelectedTabIndex(newValue);
    },
    [],
  );

  return (
    <Page
      title={t('Notifications')}
      withBackButton
      contentProps={contentProps}
      titleAction={
        !showFullEmptyState &&
        !isLoading &&
        !showFilteredEmptyState &&
        notifications.length > 0 ? (
          <Button
            variant="text"
            size="small"
            onClick={clearAll}
            disabled={isClearing}
            sx={{
              backgroundColor: 'rgba(161, 161, 170, 0.25)',
              borderRadius: '360px',
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(161, 161, 170, 0.35)',
              },
            }}
          >
            {t('Clear')}
          </Button>
        ) : undefined
      }
    >
      {isLoading && (
        <Stack gap={1} py={1}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={45}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Stack>
      )}

      {(showFullEmptyState || showFilteredEmptyState) && (
        <NotificationEmptyState />
      )}

      {!isLoading &&
        !showFullEmptyState &&
        !showFilteredEmptyState &&
        notifications.map((item, index) => {
          const isLast = index === notifications.length - 1;
          const clickable = hasActionableUrl(item);
          return (
            <Box key={item.id}>
              {renderNotificationItem(item, {
                showSeparator: !isLast,
                accessoryType: clickable ? 'chevron' : 'none',
                onClick: clickable
                  ? () => handleNotificationPress(item)
                  : undefined,
              })}
            </Box>
          );
        })}

      {!showFullEmptyState && !isLoading && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${theme.palette.background.default} 20%)`,
            pt: 3,
            pb: 2,
            px: 1.5,
          }}
        >
          <TabMenu
            size="small"
            value={selectedTabIndex}
            onChange={handleTabChange}
          >
            {TAB_ITEMS.map((tab) => (
              <Tab key={tab.value} label={t(tab.label)} />
            ))}
          </TabMenu>
        </Box>
      )}
    </Page>
  );
};
