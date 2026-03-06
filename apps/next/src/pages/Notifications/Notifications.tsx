import { useState, useCallback } from 'react';
import { Box, StackProps, alpha, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { AppNotification, NotificationTab } from '@core/types';

import { Page } from '@/components/Page';
import { Tab, TabMenu } from '@/components/TabMenu';

import { useNotifications } from './hooks/useNotifications';
import { useClearAll } from './hooks/useClearAll';
import { hasActionableUrl } from './lib/hasActionableUrl';
import { NotificationEmptyState } from './components/NotificationEmptyState';
import { NotificationItem } from './components/NotificationItem';
import { NotificationListSkeleton } from './components/NotificationListSkeleton';
import { ClearButton } from './components/ClearButton';

const contentProps: StackProps = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: 1,
  gap: 0,
  pb: 9,
};

export const Notifications = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const tabItems = [
    { label: t('All'), value: NotificationTab.ALL },
    { label: t('Transactions'), value: NotificationTab.TRANSACTIONS },
    { label: t('Prices'), value: NotificationTab.PRICE_UPDATES },
  ];

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const selectedTab = tabItems[selectedTabIndex]?.value ?? NotificationTab.ALL;
  const { notifications, isLoading } = useNotifications(selectedTab);
  const { clearAll, isClearing } = useClearAll();

  const isCurrentTabEmpty =
    notifications.length === 0 && !isClearing && !isLoading;

  const handleNotificationPress = useCallback(
    (notification: AppNotification) => {
      const url = notification.deepLinkUrl;
      if (url && hasActionableUrl(notification)) {
        window.open(url, '_blank', 'noopener,noreferrer');
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
        !isCurrentTabEmpty ? (
          <ClearButton onClick={clearAll} disabled={isClearing} />
        ) : undefined
      }
    >
      {isLoading && <NotificationListSkeleton />}

      {isCurrentTabEmpty && <NotificationEmptyState />}

      {!isCurrentTabEmpty &&
        notifications.map((item, index) => {
          const isLast = index === notifications.length - 1;
          const clickable = hasActionableUrl(item);
          return (
            <NotificationItem
              key={item.id}
              notification={item}
              showSeparator={!isLast}
              accessoryType={clickable ? 'chevron' : 'none'}
              onClick={
                clickable ? () => handleNotificationPress(item) : undefined
              }
            />
          );
        })}

      {!isLoading && (
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
            {tabItems.map((tab) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </TabMenu>
        </Box>
      )}
    </Page>
  );
};
