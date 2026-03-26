import { ComponentProps, FC } from 'react';
import { Trans } from 'react-i18next';
import { Typography } from '@avalabs/k2-alpine';

import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

type Props = {
  sum: string;
  symbol: string;
};

export const AdditiveFeesNotice: FC<Props> = ({ sum, symbol }) => {
  return (
    <Typography
      component="p"
      color="text.secondary"
      textAlign="center"
      variant="caption"
      minHeight="1lh"
    >
      {sum && symbol && (
        <Trans
          i18nKey="+<total /> {{symbol}} for bridge fees"
          components={{
            total: (
              <CollapsedTokenAmount
                amount={sum}
                {...collapsedTokenAmountProps}
              />
            ),
          }}
          values={{ symbol }}
        />
      )}
    </Typography>
  );
};

const collapsedTokenAmountProps: Omit<
  ComponentProps<typeof CollapsedTokenAmount>,
  'amount'
> = {
  regularProps: { variant: 'caption' },
  overlineProps: { variant: 'caption2', sx: { transform: 'scale(0.8)' } },
  showApproximationSign: false,
};
