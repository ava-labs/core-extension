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
import { isRecurringSwapEligible } from '../../lib/isRecurringSwapEligible';

import { RecurringSwapForm } from './RecurringSwapForm';

export const RecurringSwapToggleCard = () => {
  const { t } = useTranslation();
  const { sourceToken, targetToken } = useFusionState();
  const { isRecurring, setIsRecurring } = useRecurringSwapState();

  const isEligible = isRecurringSwapEligible({ sourceToken, targetToken });

  // Guard the setter so any path that might call setIsRecurring while the
  // pair is ineligible is a no-op. Consumers of `isRecurring` in FusionState
  // should still gate on `isRecurringSwapEligible(...)` at the read site —
  // it is the source of truth for "can this pair be recurring".
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
