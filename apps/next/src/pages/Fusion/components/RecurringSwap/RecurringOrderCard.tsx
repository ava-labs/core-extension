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
import { getFrequencyUnitLabelInline } from '../../lib/formatFrequency';
import type { RecurringSwapOrder } from '../../hooks/useRecurringSwapOrders';

import { RecurringOrderPairIcon } from './RecurringOrderPairIcon';

type RecurringOrderCardProps = {
  order: RecurringSwapOrder;
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
  onCancel,
}: RecurringOrderCardProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((current) => !current);
  }, []);

  const cancel = useCallback(() => {
    onCancel(order.id);
  }, [onCancel, order.id]);

  const scheduleSummary = t(
    'Every {{quantity}} {{unit}} · {{count}} orders total',
    {
      quantity: order.frequencyQuantity,
      unit: getFrequencyUnitLabelInline(
        order.frequencyUnit,
        order.frequencyQuantity,
        t,
      ),
      count: order.ordersTotal,
    },
  );

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
          <Stack flexGrow={1} minWidth={0} gap={2}>
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
              value={t('{{executed}} of {{total}}', {
                executed: order.ordersExecuted,
                total: order.ordersTotal,
              })}
            />
            {order.nextSwapAt !== null && (
              <DetailRow
                label={t('Next swap scheduled')}
                value={formatNextSwap(order.nextSwapAt, t)}
              />
            )}
            <Button
              fullWidth
              size="extension"
              variant="contained"
              color="secondary"
              onClick={cancel}
              data-testid={`recurring-order-cancel-${order.id}`}
            >
              {t('Cancel')}
            </Button>
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
};
