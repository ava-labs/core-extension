import { Asset, Chain, TransferManager } from '@avalabs/fusion-sdk';

import { FungibleTokenBalance } from '@core/types';

import { useQuotes } from './useQuotes';
import { useNativeFeeEstimate } from './useNativeFeeEstimate';
import { getAdditiveFees } from '../../lib/getAdditiveFees';

type UseMaxButtonFeeEstimateProps = {
  manager?: TransferManager;
  fromAddress?: string;
  toAddress?: string;
  sourceAsset?: Asset;
  sourceToken?: FungibleTokenBalance;
  sourceChain?: Chain;
  targetAsset?: Asset;
  targetChain?: Chain;
  minimumTransferAmount?: bigint;
  slippageBps?: number;
};

export const useMaxButtonFeeEstimate = ({
  manager,
  fromAddress,
  toAddress,
  sourceAsset,
  sourceChain,
  sourceToken,
  targetAsset,
  targetChain,
  minimumTransferAmount,
  slippageBps,
}: UseMaxButtonFeeEstimateProps) => {
  const skipFetching =
    !manager ||
    !fromAddress ||
    !toAddress ||
    !sourceAsset ||
    !sourceChain ||
    !targetAsset ||
    !targetChain ||
    !minimumTransferAmount ||
    !sourceToken;

  // FIXME: There seems to be a problem when we're using the actual minimum transfer amount,
  // where the SDK suggests the `minAmountOut` to be 0 (which means user may receive nothing at all).
  // This workaround won't always work, but seems enough as a temporary fix.
  const halfOfBalance = sourceToken ? sourceToken.balance / 2n : 0n;
  const simulatedTransferAmount =
    sourceToken && minimumTransferAmount
      ? halfOfBalance > minimumTransferAmount
        ? halfOfBalance
        : minimumTransferAmount
      : 0n;

  const { selectedQuote } = useQuotes(
    {
      manager,
      fromAddress,
      toAddress,
      sourceAsset,
      sourceChain,
      targetAsset,
      targetChain,
      amount: simulatedTransferAmount,
      slippageBps,
    },
    skipFetching,
  );

  const { fee, isFeeLoading, feeError } = useNativeFeeEstimate(
    manager,
    selectedQuote,
  );

  return {
    fee,
    additiveFees: getAdditiveFees(selectedQuote),
    isFeeLoading,
    feeError,
  };
};
