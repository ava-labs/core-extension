import { useTranslation } from 'react-i18next';
import { Collapse, Typography } from '@avalabs/k2-alpine';
import { MdInfoOutline } from 'react-icons/md';

import { useRecurringSwapState } from '../../contexts/RecurringSwapContext';

import { NoticeContainer, NoticeIconWrapper } from './Styled';

export const RecurringRateNotice = () => {
  const { t } = useTranslation();
  const { isRecurring } = useRecurringSwapState();

  return (
    <Collapse in={isRecurring} unmountOnExit={false}>
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
