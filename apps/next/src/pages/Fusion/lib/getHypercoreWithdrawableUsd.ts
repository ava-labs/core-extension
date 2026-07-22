import {
  spotCountsAsPerpCollateral,
  type UserAbstractionMode,
} from '@avalabs/hypercore-module';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { FungibleTokenBalance } from '@core/types';

import { isHypercoreUsdcToken } from './isHypercoreUsdcToken';

export const exceedsHypercoreWithdrawable = ({
  amount,
  withdrawableBalance,
}: {
  amount: bigint;
  withdrawableBalance: bigint | undefined;
}) => withdrawableBalance !== undefined && amount > withdrawableBalance;

/** Spot USDC not counted in withdrawable on non-unified HyperCore accounts. */
export const getHypercoreStrandedAmount = ({
  sourceToken,
  withdrawableBalance,
  abstractionMode,
}: {
  sourceToken: FungibleTokenBalance | undefined;
  withdrawableBalance: bigint | undefined;
  abstractionMode: UserAbstractionMode | undefined;
}) => {
  if (
    !isHypercoreUsdcToken(sourceToken) ||
    withdrawableBalance === undefined ||
    abstractionMode === undefined ||
    spotCountsAsPerpCollateral(abstractionMode)
  ) {
    return undefined;
  }

  const gap = sourceToken.balance - withdrawableBalance;
  return gap > 0n ? gap : undefined;
};

export const formatHypercoreStrandedAmount = (
  strandedAmount: bigint,
  token: Pick<FungibleTokenBalance, 'decimals' | 'symbol'>,
) => `${bigIntToString(strandedAmount, token.decimals)} ${token.symbol}`;
