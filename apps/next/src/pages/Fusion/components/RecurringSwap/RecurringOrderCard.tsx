import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ChevronDownIcon,
  Collapse,
  Divider,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { formatAmount } from '../../lib/formatAmount';
import { formatNextSwap } from '../../lib/formatNextSwap';
import {
  getRecurringOrderExecutedLabel,
  getRecurringOrderScheduleLabel,
} from '../../lib/recurringOrderLabels';
import type { RecurringSwapOrder } from '../../hooks/useRecurringSwapOrders';

import { RecurringOrderPairIcon } from './RecurringOrderPairIcon';

type RecurringOrderCardProps = {
  order: RecurringSwapOrder;
  onPause: (id: string) => void;
  onUnpause: (id: string) => void;
  onCancel: (id: string) => void;
};

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow = ({ label, value }: DetailRowProps) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    gap={1}
  >
    <Typography variant="subtitle3" color="text.primary">
      {label}
    </Typography>
    <Typography variant="caption" color="text.secondary" textAlign="right">
      {value}
    </Typography>
  </Stack>
);

export const RecurringOrderCard = ({
  order,
  onPause,
  onUnpause,
  onCancel,
}: RecurringOrderCardProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((current) => !current);
  }, []);

  const isPaused = order.status === 'paused';
  const pendingAction = order.pendingAction;
  const hasPendingAction = pendingAction !== undefined;

  const togglePause = useCallback(() => {
    if (isPaused) {
      onUnpause(order.id);
    } else {
      onPause(order.id);
    }
  }, [isPaused, onPause, onUnpause, order.id]);

  const cancel = useCallback(() => {
    onCancel(order.id);
  }, [onCancel, order.id]);

  const getPauseLabel = () => {
    if (pendingAction === 'pause') return t('Pausing');
    if (pendingAction === 'unpause') return t('Resuming');
    return isPaused ? t('Resume') : t('Pause');
  };

  const scheduleSummary = getRecurringOrderScheduleLabel(order, t);

  return (
    <Card noPadding data-testid={`recurring-order-card-${order.id}`}>
      <Stack width="100%">
        <Stack
          direction="row"
          alignItems="flex-start"
          gap={1}
          px={2}
          py={1.5}
          onClick={toggleExpanded}
          sx={{ cursor: 'pointer' }}
          data-testid={`recurring-order-toggle-${order.id}`}
        >
          <Stack flexGrow={1} minWidth={0} gap={2} textAlign="center">
            <RecurringOrderPairIcon
              sourceToken={order.sourceToken}
              targetToken={order.targetToken}
            />
            <Stack gap={0.5} minWidth={0}>
              <Typography variant="subtitle3" color="text.primary" noWrap>
                {formatAmount(order.amountPerSwap)} {order.sourceToken.symbol} →{' '}
                {order.targetToken.symbol}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {scheduleSummary}
              </Typography>
            </Stack>
            {order.status === 'paused' && (
              <Typography variant="caption" color="text.secondary">
                {t('Paused')}
              </Typography>
            )}
          </Stack>
          <ChevronDownIcon
            size={20}
            sx={{
              flexShrink: 0,
              mt: 0.5,
              transition: 'transform 0.2s ease',
              transform: isExpanded ? 'rotateX(180deg)' : 'none',
              color: 'text.secondary',
            }}
          />
        </Stack>

        <Collapse in={isExpanded} unmountOnExit={false}>
          <Divider sx={{ mx: 2 }} />
          <Stack px={2} py={1.5} gap={1.5}>
            <DetailRow
              label={t('Orders executed')}
              value={getRecurringOrderExecutedLabel(order, t)}
            />
            <DetailRow
              label={t('Next swap scheduled')}
              value={
                order.nextSwapAt !== null
                  ? formatNextSwap(order.nextSwapAt, t)
                  : '—'
              }
            />
            <Stack direction="row" gap={1}>
              <Button
                fullWidth
                size="extension"
                variant="contained"
                color="secondary"
                loading={
                  pendingAction === 'pause' || pendingAction === 'unpause'
                }
                disabled={hasPendingAction}
                onClick={togglePause}
                data-testid={`recurring-order-pause-${order.id}`}
              >
                {getPauseLabel()}
              </Button>
              <Button
                fullWidth
                size="extension"
                variant="contained"
                color="secondary"
                loading={pendingAction === 'cancel'}
                disabled={hasPendingAction}
                onClick={cancel}
                sx={{ color: 'error.main' }}
                data-testid={`recurring-order-cancel-${order.id}`}
              >
                {pendingAction === 'cancel' ? t('Cancelling') : t('Cancel')}
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
};
