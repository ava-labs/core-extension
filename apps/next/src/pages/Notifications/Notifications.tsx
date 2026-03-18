import { useState, useCallback, useMemo } from 'react';
import { Box, StackProps, alpha, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { NotificationTab } from '@core/types';

import { Page } from '@/components/Page';
import { Tab, TabMenu } from '@/components/TabMenu';

import { useNotifications } from './hooks/useNotifications';
import { useClearAll } from './hooks/useClearAll';
import { NotificationEmptyState } from './components/NotificationEmptyState';
import { NotificationItem } from './components/NotificationItem';
import { NotificationListSkeleton } from './components/NotificationListSkeleton';
import { ClearButton } from './components/ClearButton';
import { combineActivityItems } from './lib/combineActivityItems';
import { useTransferTrackingContext } from '@core/ui';
import { useNextUnifiedBridgeContext } from '../Bridge/contexts';

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

  const { notifications, isLoading: isNotificationsLoading } =
    useNotifications(selectedTab);
  const { transfers, isLoading: isTransfersLoading } =
    useTransferTrackingContext();
  const {
    state: { pendingTransfers },
  } = useNextUnifiedBridgeContext();
  const { clearAll, isClearing } = useClearAll();

  const isLoading = isNotificationsLoading || isTransfersLoading;

  const isAllOrTransactionsTab =
    selectedTab === NotificationTab.TRANSACTIONS ||
    selectedTab === NotificationTab.ALL;

  const combinedItems = useMemo(
    () =>
      isLoading
        ? []
        : combineActivityItems(
            notifications,
            isAllOrTransactionsTab
              ? transfers.map(({ transfer }) => transfer)
              : [],
            isAllOrTransactionsTab ? Object.values(pendingTransfers) : [],
          ),
    [
      notifications,
      transfers,
      pendingTransfers,
      isAllOrTransactionsTab,
      isLoading,
    ],
  );

  const isCurrentTabEmpty =
    combinedItems.length === 0 && !isClearing && !isLoading;

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setSelectedTabIndex(newValue);
    },
    [],
  );

  const showClearButton = !isCurrentTabEmpty;

  return (
    <Page
      title={t('Notifications')}
      withBackButton
      contentProps={contentProps}
      headerProps={{
        px: 2,
      }}
      titleAction={
        showClearButton ? (
          <ClearButton onClick={clearAll} disabled={isClearing} />
        ) : undefined
      }
      px={0}
    >
      {isLoading && <NotificationListSkeleton />}
      {isCurrentTabEmpty && <NotificationEmptyState />}
      {combinedItems.map((combined, index) => (
        <NotificationItem
          key={combined.id}
          item={combined}
          showSeparator={index < combinedItems.length - 1}
        />
      ))}

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
