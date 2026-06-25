import { Trans, useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { Skeleton, Stack, Typography, styled } from '@avalabs/k2-alpine';

import { Page } from '@/components/Page';
import { LoadingScreen } from '@/components/LoadingScreen';

import { RecurringOrderCard } from './components/RecurringSwap/RecurringOrderCard';
import { useIsRecurringSwapsEnabled } from './hooks/useIsRecurringSwapsEnabled';
import { useRecurringSwapOrders } from './hooks/useRecurringSwapOrders';

// Rendered inline inside the `h2` title as a single-digit placeholder.
// `overflow: hidden` makes the inline-block's baseline its bottom edge, so the
// bar sits on the text baseline just like the digit it replaces — keeping the
// line height + baseline identical between the loading and loaded states (no
// jump). `color: transparent` hides the `{{count}}` text node Trans injects
// (MUI's Skeleton only hides element children, not text nodes).
const CountSkeleton = styled(Skeleton)({
  display: 'inline-block',
  overflow: 'hidden',
  color: 'transparent',
});

type RecurringSwapsTitleProps = {
  count: number;
  isLoading: boolean;
};

// Singular/plural are kept as two static literal keys (rather than i18next's
// `count`-based plurals) because the scanner can't extract a ternary i18nKey
// and resets generated `_plural` values on every run. The `<count>` slot
// renders the count, or a skeleton placeholder while loading.
const RecurringSwapsTitle = ({
  count,
  isLoading,
}: RecurringSwapsTitleProps) => {
  const components = {
    count: isLoading ? (
      <CountSkeleton variant="rounded" width="1ch" height="0.9em" />
    ) : (
      <span />
    ),
  };

  return count === 1 ? (
    <Trans
      i18nKey="<count>{{count}}</count> recurring swap scheduled"
      values={{ count }}
      components={components}
    />
  ) : (
    <Trans
      i18nKey="<count>{{count}}</count> recurring swaps scheduled"
      values={{ count }}
      components={components}
    />
  );
};

export const RecurringSwaps = () => {
  const { t } = useTranslation();
  const isRecurringSwapsEnabled = useIsRecurringSwapsEnabled();
  const {
    orders,
    scheduledCount,
    pauseOrder,
    unpauseOrder,
    cancelOrder,
    isLoading,
  } = useRecurringSwapOrders();

  if (!isRecurringSwapsEnabled) {
    return <Redirect to="/" />;
  }

  return (
    <Page
      title={
        <RecurringSwapsTitle count={scheduledCount} isLoading={isLoading} />
      }
      withBackButton
      contentProps={{ justifyContent: 'flex-start', alignItems: 'stretch' }}
    >
      {isLoading ? (
        <LoadingScreen height="100%" width="100%" />
      ) : orders.length === 0 ? (
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
              onPause={pauseOrder}
              onUnpause={unpauseOrder}
              onCancel={cancelOrder}
            />
          ))}
        </Stack>
      )}
    </Page>
  );
};
