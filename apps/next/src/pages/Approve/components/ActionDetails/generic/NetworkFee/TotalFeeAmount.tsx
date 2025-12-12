import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TxDetailsRow } from '../DetailsItem/items/DetailRow';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { useSettingsContext } from '@core/ui';

type TotalFeeAmountProps = {
  fee: string;
  symbol: string;
  currencyValue: number;
};

export const TotalFeeAmount: FC<TotalFeeAmountProps> = ({
  fee,
  symbol,
  currencyValue,
}) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();

  return (
    <TxDetailsRow alignItems="start" label={t('Total network fee')}>
      <Stack textAlign="end">
        <Stack direction="row" alignItems="center" gap={0.5}>
          <CollapsedTokenAmount
            amount={fee}
            regularProps={{ variant: 'body3' }}
            overlineProps={{ variant: 'caption2' }}
          />
          {symbol && <Typography variant="body3">{symbol}</Typography>}
        </Stack>
        {typeof currencyValue === 'number' && (
          <Typography variant="caption" color="text.secondary">
            {currencyFormatter(currencyValue)}
          </Typography>
        )}
      </Stack>
    </TxDetailsRow>
  );
};
