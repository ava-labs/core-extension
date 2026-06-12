import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { Page } from '@/components/Page';

import { RecurringOrderCard } from './components/RecurringSwap/RecurringOrderCard';
import { useIsRecurringSwapsEnabled } from './hooks/useIsRecurringSwapsEnabled';
import { useRecurringSwapOrders } from './hooks/useRecurringSwapOrders';

export const RecurringSwaps = () => {
  const { t } = useTranslation();
  const isRecurringSwapsEnabled = useIsRecurringSwapsEnabled();
  const { orders, scheduledCount, cancelOrder } = useRecurringSwapOrders();

  if (!isRecurringSwapsEnabled) {
    return <Redirect to="/" />;
  }

  const title =
    scheduledCount === 1
      ? t('{{count}} recurring swap scheduled', { count: scheduledCount })
      : t('{{count}} recurring swaps scheduled', { count: scheduledCount });

  return (
    <Page
      title={title}
      withBackButton
      contentProps={{ justifyContent: 'flex-start', alignItems: 'stretch' }}
    >
      {orders.length === 0 ? (
        <Stack flexGrow={1} alignItems="center" justifyContent="center">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t('You have no recurring swaps scheduled.')}
          </Typography>
        </Stack>
      ) : (
        <Stack width="100%" gap={1}>
          {orders.map((order) => (
            <RecurringOrderCard
              key={order.id}
              order={order}
              onCancel={cancelOrder}
            />
          ))}
        </Stack>
      )}
    </Page>
  );
};
