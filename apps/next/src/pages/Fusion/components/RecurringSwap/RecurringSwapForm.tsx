import { useTranslation } from 'react-i18next';
import { Divider, PopoverItem, Stack, Typography } from '@avalabs/k2-alpine';

import { DropdownMenu } from '@/components/DropdownMenu';

import * as Styled from '../Styled';

import {
  MIN_FREQUENCY_QUANTITY,
  MIN_NUMBER_OF_ORDERS,
  useRecurringSwapState,
} from '../../contexts/RecurringSwapContext';
import { useFusionState } from '../../contexts/FusionStateContext';
import { formatAmount } from '../../lib/formatAmount';
import {
  FREQUENCY_UNITS,
  getFrequencyUnitLabel,
} from '../../lib/formatFrequency';
import { parseIntegerInput } from '../../lib/parseIntegerInput';

import { InputPill } from './Styled';

export const RecurringSwapForm = () => {
  const { t } = useTranslation();
  const {
    frequencyQuantity,
    setFrequencyQuantity,
    frequencyUnit,
    setFrequencyUnit,
    numberOfOrders,
    setNumberOfOrders,
  } = useRecurringSwapState();
  const { userAmount, sourceToken, targetToken } = useFusionState();

  const sourceSymbol = sourceToken?.symbol ?? '';
  const targetSymbol = targetToken?.symbol ?? '';
  const perSwapAmount = Number(userAmount || 0);
  const totalSpend = perSwapAmount * numberOfOrders;
  const unitLabel = getFrequencyUnitLabel(frequencyUnit, frequencyQuantity, t);

  return (
    <Stack width="100%" px={2} divider={<Divider />}>
      <Styled.SettingRow
        title={t('Frequency')}
        tooltip={t(
          'How often the recurring swap will execute. Minimum is 5 minutes between executions.',
        )}
      >
        <Stack direction="row" alignItems="center" gap={0.75}>
          <Typography variant="caption" color="text.secondary">
            {t('Every')}
          </Typography>
          <InputPill
            type="number"
            inputMode="numeric"
            min={MIN_FREQUENCY_QUANTITY}
            value={frequencyQuantity}
            onChange={(event) =>
              setFrequencyQuantity(
                parseIntegerInput(event.target.value, MIN_FREQUENCY_QUANTITY),
              )
            }
            style={{ width: 44 }}
            aria-label={t('Frequency')}
            data-testid="recurring-swap-frequency-quantity"
          />
          <DropdownMenu
            label={unitLabel}
            dataTestId="recurring-swap-frequency-unit"
          >
            {FREQUENCY_UNITS.map((unit) => (
              <PopoverItem
                key={unit}
                onClick={() => setFrequencyUnit(unit)}
                selected={unit === frequencyUnit}
                data-testid={`recurring-swap-frequency-unit-option-${unit}`}
              >
                {getFrequencyUnitLabel(unit, frequencyQuantity, t)}
              </PopoverItem>
            ))}
          </DropdownMenu>
        </Stack>
      </Styled.SettingRow>

      <Styled.SettingRow
        title={t('Number of orders')}
        tooltip={t(
          'Total number of swaps that will be executed on this schedule.',
        )}
      >
        <Stack direction="row" alignItems="center" gap={0.75}>
          <InputPill
            type="number"
            inputMode="numeric"
            min={MIN_NUMBER_OF_ORDERS}
            value={numberOfOrders}
            onChange={(event) =>
              setNumberOfOrders(
                parseIntegerInput(event.target.value, MIN_NUMBER_OF_ORDERS),
              )
            }
            style={{ width: 56 }}
            aria-label={t('Number of orders')}
            data-testid="recurring-swap-orders"
          />
          <Typography variant="caption" color="text.secondary">
            {t('orders')}
          </Typography>
        </Stack>
      </Styled.SettingRow>

      <Stack pb={1}>
        <Styled.SettingRow title={t('Summary')}>
          <Typography
            variant="caption"
            color="text.secondary"
            data-testid="recurring-swap-total-spend"
          >
            {/* The colon lives outside `t()` because i18next's default
                `nsSeparator: ':'` splits keys on the first colon, which would
                hide the "Est. total spend" portion of a single-key string. */}
            {t('Est. total spend')}: {formatAmount(totalSpend)} {sourceSymbol}
          </Typography>
        </Styled.SettingRow>
        <Stack gap={0.25}>
          <Typography
            variant="caption2"
            color="text.secondary"
            lineHeight={1.4}
          >
            {t(
              'You will swap {{amount}} {{from}} for {{to}} every {{quantity}} {{unit}}, for {{orders}} orders.',
              {
                amount: formatAmount(perSwapAmount),
                from: sourceSymbol,
                to: targetSymbol,
                quantity: frequencyQuantity,
                unit: unitLabel.toLowerCase(),
                orders: numberOfOrders,
              },
            )}
          </Typography>
          <Typography
            variant="caption2"
            color="text.secondary"
            lineHeight={1.4}
          >
            {t('First swap executes immediately after approval.')}
          </Typography>
          <Typography
            variant="caption2"
            color="text.secondary"
            lineHeight={1.4}
          >
            {t(
              'Each swap requires sufficient balance, otherwise the swap will fail.',
            )}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
