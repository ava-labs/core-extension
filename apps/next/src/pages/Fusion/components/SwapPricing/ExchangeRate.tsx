import { isNil } from 'lodash';
import { useRef } from 'react';
import { Trans } from 'react-i18next';
import { Skeleton, Typography, TypographyProps } from '@avalabs/k2-alpine';

import { PartialBy } from '@core/types';

import { useFusionState } from '../../contexts';
import { calculateRate } from '../../lib/calculateRate';

export const ExchangeRate = (props: TypographyProps) => {
  const { fromToken, toToken, userQuote, bestQuote } = useFusionState();

  const quote = userQuote ?? bestQuote;
  const rateData: Partial<RateData> = {
    rate: quote ? calculateRate(quote) : undefined,
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
