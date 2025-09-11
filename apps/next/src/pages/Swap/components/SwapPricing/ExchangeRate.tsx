import { isNil } from 'lodash';
import { useRef } from 'react';
import { Trans } from 'react-i18next';
import { Skeleton, Typography, TypographyProps } from '@avalabs/k2-alpine';

import { PartialBy } from '@core/types';
import { calculateRate } from '@core/ui';

import { useSwapState } from '../../contexts';

export const ExchangeRate = (props: TypographyProps) => {
  const { fromToken, toToken, quote } = useSwapState();

  const rateData: Partial<RateData> = {
    rate:
      fromToken && toToken && quote
        ? calculateRate(quote, {
            srcDecimals: fromToken.decimals,
            destDecimals: toToken.decimals,
          })
        : undefined,
    fromSymbol: fromToken?.symbol,
    toSymbol: toToken?.symbol,
  };

  const rateRef = useRef<HTMLSpanElement>(null);
  const skeletonWidth = rateRef.current?.offsetWidth ?? 30;

  return (
    <Typography variant="body3" {...props}>
      {hasTokens(rateData) ? (
        <Trans
          i18nKey="1 {{from}} = <rate>{{rate}}</rate> {{to}}"
          values={{
            from: rateData.fromSymbol,
            to: rateData.toSymbol,
            rate: rateData.rate?.toFixed(4),
          }}
          components={{
            rate: hasRate(rateData) ? (
              <span ref={rateRef} />
            ) : (
              <Skeleton
                variant="text"
                width={skeletonWidth}
                sx={{ display: 'inline-block' }}
              />
            ),
          }}
        />
      ) : (
        '-'
      )}
    </Typography>
  );
};

type RateData = {
  rate: number;
  fromSymbol: string;
  toSymbol: string;
};

const hasTokens = (
  data: Partial<RateData>,
): data is PartialBy<RateData, 'rate'> => {
  return !isNil(data.fromSymbol) && !isNil(data.toSymbol);
};

const hasRate = (data: Partial<RateData>): data is RateData => {
  return !isNil(data.rate) && hasTokens(data);
};
