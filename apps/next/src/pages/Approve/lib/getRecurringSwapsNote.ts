import { type TFunction } from 'react-i18next';
import { RecurringSwapsContext } from '@core/types';

export type RecurringSwapsNote = {
  title: string;
  description: string;
};

export const getRecurringSwapsNote = (
  recurringSwaps: RecurringSwapsContext,
  t: TFunction,
): RecurringSwapsNote => {
  const from = recurringSwaps.fromTokenSymbol ?? '';
  const to = recurringSwaps.toTokenSymbol ?? '';

  switch (recurringSwaps.action) {
    case 'schedule':
      return {
        title: t('Scheduling recurring swap'),
        description: t(
          'Sets up the recurring {{from}} → {{to}} schedule and submits the first swap now. A one-time schedule fee applies.',
          { from, to },
        ),
      };
    case 'pause':
      return {
        title: t('Pausing recurring swap'),
        description: t(
          'Pauses the recurring {{from}} → {{to}} schedule. Existing allowance is preserved. The schedule may still execute one more fill until this transaction confirms on-chain.',
          { from, to },
        ),
      };
    case 'unpause':
      return {
        title: t('Unpausing recurring swap'),
        description: t(
          'Resumes the recurring {{from}} → {{to}} schedule. Remaining fills will execute on the original cadence once this transaction confirms on-chain.',
          { from, to },
        ),
      };
    case 'cancel':
    default:
      return {
        title: t('Cancelling recurring swap'),
        description: t(
          'Cancels the recurring {{from}} → {{to}} schedule. No further swaps will execute after this transaction confirms on-chain.',
          { from, to },
        ),
      };
  }
};
