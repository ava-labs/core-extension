import { useTranslation } from 'react-i18next';
import { Stack, Tooltip, Typography } from '@avalabs/core-k2-components';

import { DefiInsuranceBuyerItem } from 'packages/service-worker/src/services/defi/models';

import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';

type Props = {
  items: DefiInsuranceBuyerItem[];
};

export const DefiPortfolioInsurance = ({ items }: Props) => {
  const { t } = useTranslation();
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <Stack sx={{ gap: 1.25 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="button">{t('Description')}</Typography>
        <Typography variant="button">{t('Value')}</Typography>
      </Stack>

      <Stack sx={{ gap: 2 }}>
        {items.map(({ description, netUsdValue }, index) => (
          <Stack
            key={`defi-insurance-${index}`}
            direction="row"
            sx={{ gap: 2, justifyContent: 'space-between' }}
            data-testid="defi-item"
          >
            <Tooltip title={description} wrapWithSpan={false}>
              <Typography
                variant="caption"
                data-testid="defi-item-description"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {description}
              </Typography>
            </Tooltip>
            <Stack sx={{ gap: 0.5, textAlign: 'end' }}>
              <Typography variant="caption" data-testid="defi-item-value">
                {formatValue(netUsdValue)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
