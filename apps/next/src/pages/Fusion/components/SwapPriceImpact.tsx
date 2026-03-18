import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';

import { useFusionState } from '../contexts';
import * as Styled from './Styled';

export const SwapPriceImpact = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { priceImpact, priceImpactSeverity } = useFusionState();

  if (priceImpact === undefined) {
    return null;
  }

  const isHighOrCritical =
    priceImpactSeverity === 'high' || priceImpactSeverity === 'critical';
  const color = isHighOrCritical ? 'error.main' : 'text.primary';
  const formattedImpact = `${priceImpact.toFixed(2)}%`;

  return (
    <Styled.SettingRow
      title={t('Price impact')}
      tooltip={t(
        'Price impact is the effect of your swap on the price of a token. It is influenced by your order size and available liquidity. Core has no control over price impact.',
      )}
    >
      <Stack direction="row" alignItems="center" gap={0.5}>
        {isHighOrCritical && (
          <MdErrorOutline size={16} color={theme.palette.error.main} />
        )}
        <Typography variant="body3" color={color}>
          {isHighOrCritical
            ? t('{{impact}} (High)', { impact: formattedImpact })
            : formattedImpact}
        </Typography>
      </Stack>
    </Styled.SettingRow>
  );
};
