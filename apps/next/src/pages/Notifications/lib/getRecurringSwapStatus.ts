import { TFunction } from 'i18next';

export type RecurringSwapStatusSeverity = 'success' | 'neutral';

export type RecurringSwapStatusDisplay = {
  label: string;
  severity: RecurringSwapStatusSeverity;
};

/**
 * Maps the backend order status to the status row shown under a recurring swap
 * notification. Returns `null` for unknown values that shouldn't surface a label.
 */
export const getRecurringSwapStatusDisplay = (
  status: string | undefined,
  t: TFunction,
): RecurringSwapStatusDisplay | null => {
  switch ((status ?? '').toLowerCase()) {
    case 'completed':
      return { label: t('Completed'), severity: 'success' };
    case 'active':
      return { label: t('In progress'), severity: 'neutral' };
    default:
      return null;
  }
};

export const RECURRING_SWAP_SEVERITY_COLOR: Record<
  RecurringSwapStatusSeverity,
  string
> = {
  success: 'success.main',
  neutral: 'text.secondary',
};
