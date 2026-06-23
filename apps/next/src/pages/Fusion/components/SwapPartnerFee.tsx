import { useTranslation } from 'react-i18next';
import { Collapse, Typography } from '@avalabs/k2-alpine';

import { useFusionState } from '../contexts';
import { formatBasisPointsToPercentage } from '../lib/formatBasisPointsToPercentage';

export const SwapPartnerFee = () => {
  const { t } = useTranslation();
  const { selectedQuote } = useFusionState();

  const coreFee = selectedQuote?.partnerFeeBps
    ? formatBasisPointsToPercentage(selectedQuote.partnerFeeBps)
    : '';

  return (
    <Collapse in={Boolean(coreFee)}>
      <Typography
        variant="caption2"
        component="p"
        textAlign="center"
        color="text.secondary"
        mx={2}
      >
        {t('Quote includes a {{coreFee}} Core fee', {
          coreFee,
        })}
      </Typography>
    </Collapse>
  );
};
