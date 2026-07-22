import { Card, Typography } from '@avalabs/k2-alpine';
import { type UserAbstractionMode } from '@avalabs/hypercore-module';
import { isNil } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FungibleTokenBalance } from '@core/types';

import {
  formatHypercoreStrandedAmount,
  getHypercoreStrandedAmount,
} from '../lib/getHypercoreWithdrawableUsd';

type SwapHypercoreStrandedMessageProps = {
  sourceToken: FungibleTokenBalance | undefined;
  withdrawableBalance: bigint | undefined;
  abstractionMode: UserAbstractionMode | undefined;
};

export const SwapHypercoreStrandedMessage = ({
  sourceToken,
  withdrawableBalance,
  abstractionMode,
}: SwapHypercoreStrandedMessageProps) => {
  const { t } = useTranslation();

  const strandedAmount = useMemo(
    () =>
      getHypercoreStrandedAmount({
        sourceToken,
        withdrawableBalance,
        abstractionMode,
      }),
    [sourceToken, withdrawableBalance, abstractionMode],
  );

  if (isNil(strandedAmount) || isNil(sourceToken)) {
    return null;
  }

  const formattedGap = formatHypercoreStrandedAmount(
    strandedAmount,
    sourceToken,
  );

  return (
    <Card>
      <Typography
        color="warning.main"
        variant="subtitle2"
        data-testid="fusion-swap-hypercore-stranded-message"
      >
        {t(
          "{{amount}} of your USDC is held in a separate HyperCore balance and can't be swapped directly. Enable a unified account to swap it.",
          { amount: formattedGap },
        )}
      </Typography>
    </Card>
  );
};
