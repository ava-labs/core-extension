import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Collapse,
  Divider,
  Stack,
  Switch,
  Typography,
} from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { useRecurringSwapState } from '../../contexts/RecurringSwapContext';
import { useFusionState } from '../../contexts/FusionStateContext';

import { RecurringSwapForm } from './RecurringSwapForm';

export const RecurringSwapToggleCard = () => {
  const { t } = useTranslation();
  const { recurringEligibility } = useFusionState();
  const { isRecurring, setIsRecurring } = useRecurringSwapState();

  const isEligible = recurringEligibility.isEligible;

  // Ignore toggles for ineligible pairs (e.g. a stale URL state).
  const handleToggleChange = useCallback(
    (_: unknown, checked: boolean) => {
      if (checked && !isEligible) {
        return;
      }
      setIsRecurring(checked);
    },
    [isEligible, setIsRecurring],
  );

  return (
    <Collapse in={isEligible}>
      <Card data-testid="recurring-swap-card">
        <Stack width="100%">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
            py={1}
          >
            <Typography variant="body3">
              {t('Make this swap recurring')}
            </Typography>
            <Switch
              size="small"
              checked={isRecurring}
              onChange={handleToggleChange}
              aria-label={t('Make this swap recurring')}
              data-testid="recurring-swap-toggle"
            />
          </Stack>

          <Collapse in={isRecurring} unmountOnExit={false}>
            <Divider />
            <RecurringSwapForm />
          </Collapse>
        </Stack>
      </Card>
    </Collapse>
  );
};
