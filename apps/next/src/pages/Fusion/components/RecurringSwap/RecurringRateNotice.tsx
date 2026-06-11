import { useTranslation } from 'react-i18next';
import { Collapse, Typography } from '@avalabs/k2-alpine';
import { MdInfoOutline } from 'react-icons/md';

import { useFusionState } from '../../contexts/FusionStateContext';
import { useRecurringSwapState } from '../../contexts/RecurringSwapContext';
import { isRecurringSwapEligible } from '../../lib/isRecurringSwapEligible';

import { NoticeContainer, NoticeIconWrapper } from './Styled';

export const RecurringRateNotice = () => {
  const { t } = useTranslation();
  const { isRecurring } = useRecurringSwapState();
  const { sourceToken, targetToken } = useFusionState();

  // `isRecurring` is sticky in the URL and may stay `true` after the user
  // switches to an ineligible pair, so we also defensively check eligibility
  // here — without it the disclaimer can render under a non-recurring pair.
  const isEligible = isRecurringSwapEligible({ sourceToken, targetToken });

  return (
    <Collapse in={isRecurring && isEligible} unmountOnExit={false}>
      <NoticeContainer data-testid="recurring-swap-rate-notice">
        <NoticeIconWrapper>
          <MdInfoOutline size={18} />
        </NoticeIconWrapper>
        <Typography variant="caption2" color="text.secondary" lineHeight={1.4}>
          {t(
            'Swap rate listed is for the first swap. Subsequent swaps will use the market price.',
          )}
        </Typography>
      </NoticeContainer>
    </Collapse>
  );
};
