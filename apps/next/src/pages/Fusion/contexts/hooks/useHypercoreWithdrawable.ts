import { skipToken, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { stringToBigint } from '@core/common';
import { Account, ExtensionRequest, FungibleTokenBalance } from '@core/types';
import { useConnectionContext } from '@core/ui';
import type { GetHypercoreWithdrawableHandler } from '@core/service-worker';

import { exceedsHypercoreWithdrawable } from '../../lib/getHypercoreWithdrawableUsd';
import { isHypercoreUsdcToken } from '../../lib/isHypercoreUsdcToken';

const STALE_TIME_MS = 60_000;

type UseHypercoreWithdrawableParams = {
  account: Account | undefined;
  sourceToken: FungibleTokenBalance | undefined;
  sourceTokenList: FungibleTokenBalance[];
  sourceAmount: bigint;
};

export const useHypercoreWithdrawable = ({
  account,
  sourceToken,
  sourceTokenList,
  sourceAmount,
}: UseHypercoreWithdrawableParams) => {
  const { request } = useConnectionContext();

  const isHypercoreUsdcSource = isHypercoreUsdcToken(sourceToken);
  const hypercoreUsdcToken = useMemo(
    () => sourceTokenList.find(isHypercoreUsdcToken),
    [sourceTokenList],
  );

  const evmAddress = account?.addressC;
  const queryEnabled = hypercoreUsdcToken !== undefined && Boolean(evmAddress);

  const { data } = useQuery({
    staleTime: STALE_TIME_MS,
    queryKey: ['hypercoreWithdrawable', evmAddress, queryEnabled],
    queryFn:
      queryEnabled && evmAddress
        ? () =>
            request<GetHypercoreWithdrawableHandler>({
              method: ExtensionRequest.HYPERCORE_GET_WITHDRAWABLE,
              params: [evmAddress],
            })
        : skipToken,
  });

  const decimals = hypercoreUsdcToken?.decimals ?? 8;

  const hypercoreWithdrawableBalance = useMemo(() => {
    if (!queryEnabled || !data) {
      return undefined;
    }

    try {
      const raw = stringToBigint(data.withdrawableUsd, decimals);
      return raw > 0n ? raw : 0n;
    } catch {
      return undefined;
    }
  }, [queryEnabled, data, decimals]);

  const exceedsHypercoreWithdrawableAmount =
    isHypercoreUsdcSource &&
    exceedsHypercoreWithdrawable({
      amount: sourceAmount,
      withdrawableBalance: hypercoreWithdrawableBalance,
    });

  return {
    isHypercoreUsdcSource,
    hypercoreWithdrawableBalance: isHypercoreUsdcSource
      ? hypercoreWithdrawableBalance
      : undefined,
    hypercoreAbstractionMode: isHypercoreUsdcSource
      ? data?.abstractionMode
      : undefined,
    exceedsHypercoreWithdrawableAmount,
  };
};
