import { ComponentProps, FC } from 'react';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { Divider, Stack, styled, Typography } from '@avalabs/k2-alpine';

import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

import { TokenAmount } from './types';

const collapsedTokenAmountProps: Omit<
  ComponentProps<typeof CollapsedTokenAmount>,
  'amount'
> = {
  regularProps: {
    variant: 'subtitle3',
  },
  overlineProps: {
    variant: 'caption2',
  },
  showApproximationSign: false,
};

const FeesDivider = styled(Divider)(({ theme }) => ({
  marginBlock: theme.spacing(0.5),
}));

export const SwapFeesBreakdown: FC<{ tokenAmounts: TokenAmount[] }> = ({
  tokenAmounts,
}) => {
  return (
    <Stack divider={<FeesDivider />}>
      {tokenAmounts.map((tokenAmount) => (
        <Stack
          key={`${tokenAmount.token.chainCaipId}-${tokenAmount.token.symbol}`}
          direction="row"
          alignItems="center"
          gap={0.5}
        >
          <CollapsedTokenAmount
            amount={bigIntToString(
              tokenAmount.amount,
              tokenAmount.token.decimals,
            )}
            {...collapsedTokenAmountProps}
          />
          <Typography variant="body3">{tokenAmount.token.symbol}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};
