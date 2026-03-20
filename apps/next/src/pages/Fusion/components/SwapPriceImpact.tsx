import { Box, Stack, Tooltip, Typography, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';

import { useFusionState } from '../contexts';
import * as Styled from './Styled';

export const SwapPriceImpact = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { priceImpact, priceImpactSeverity, priceImpactAvailability } =
    useFusionState();

  if (priceImpactAvailability === 'unavailable') {
    return (
      <Styled.SettingRow title={t('Price impact')}>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Tooltip
            title={t(
              "Price data unavailable for one or more tokens. Core can't estimate how much this swap may impact the price. Proceed with caution.",
            )}
          >
            <Box
              component="span"
              display="inline-flex"
              flexShrink={0}
              lineHeight={1}
              style={{ cursor: 'pointer' }}
            >
              <MdErrorOutline size={16} color={theme.palette.error.main} />
            </Box>
          </Tooltip>
          <Typography variant="body3" color="error.main">
            {t('Unknown risk')}
          </Typography>
        </Stack>
      </Styled.SettingRow>
    );
  }

  if (priceImpactAvailability !== 'ready' || priceImpact === undefined) {
    return null;
  }

  const isHighOrCritical =
    priceImpactSeverity === 'high' || priceImpactSeverity === 'critical';
  const color = isHighOrCritical ? 'error.main' : 'text.primary';
  const formattedImpact = `${priceImpact.toFixed(2)}%`;

  return (
    <Styled.SettingRow title={t('Price impact')}>
      <Stack direction="row" alignItems="center" gap={0.5}>
        {isHighOrCritical && (
          <Tooltip
            title={t(
              'Price impact is the effect of your swap on the price of a token. It is influenced by your order size and available liquidity. Core has no control over price impact.',
            )}
          >
            <Box
              component="span"
              display="inline-flex"
              flexShrink={0}
              lineHeight={1}
              style={{ cursor: 'pointer' }}
            >
              <MdErrorOutline size={16} color={theme.palette.error.main} />
            </Box>
          </Tooltip>
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
