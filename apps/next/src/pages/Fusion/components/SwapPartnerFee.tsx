import { useTranslation, type TFunction } from 'react-i18next';
import { Collapse, Typography } from '@avalabs/k2-alpine';

import { useFusionState } from '../contexts';
import { formatBasisPointsToPercentage } from '../lib/formatBasisPointsToPercentage';

const getFeeNotice = (
  t: TFunction,
  coreFee: string,
  scheduleFee: string,
): string => {
  if (coreFee && scheduleFee) {
    return t(
      'Quote includes a {{coreFee}} Core fee and a {{scheduleFee}} schedule fee',
      { coreFee, scheduleFee },
    );
  }
  if (scheduleFee) {
    return t('Quote includes a {{scheduleFee}} schedule fee', { scheduleFee });
  }
  return t('Quote includes a {{coreFee}} Core fee', { coreFee });
};

export const SwapPartnerFee = () => {
  const { t } = useTranslation();
  const { selectedQuote, recurringScheduleFee } = useFusionState();

  const coreFee = selectedQuote?.partnerFeeBps
    ? formatBasisPointsToPercentage(selectedQuote.partnerFeeBps)
    : '';
  const scheduleFee = recurringScheduleFee ?? '';

  return (
    <Collapse in={Boolean(coreFee || scheduleFee)}>
      <Typography
        variant="caption2"
        component="p"
        textAlign="center"
        color="text.secondary"
        mx={2}
      >
        {getFeeNotice(t, coreFee, scheduleFee)}
      </Typography>
    </Collapse>
  );
};
