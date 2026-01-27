import { AVALANCHE_BLOCKCHAIN_IDS, caipToChainId } from '@core/common';
import { AtomicBalances } from '@core/types';
import { merge } from 'lodash';
import { CORE_ETH_CAIP2ID } from '~/api-clients/constants';
import { BalanceResponse } from '~/api-clients/types';
import {
  isAvmGetBalancesResponse,
  isCorethGetBalancesResponse,
  isPvmGetBalancesResponse,
} from './type-guards';

const getChainId = (balanceResponse: BalanceResponse): number => {
  try {
    return caipToChainId(balanceResponse.caip2Id);
  } catch (error) {
    // if we are throwing error because of CoreEth, we are ignoring it
    if (
      !(error instanceof Error) ||
      !error.message.includes(CORE_ETH_CAIP2ID)
    ) {
      throw error;
    }

    return 0;
  }
};

export const convertBalanceResponseToAtomicCacheBalanceObject = (
  balanceResponses: BalanceResponse[],
): AtomicBalances => {
  return balanceResponses.reduce<AtomicBalances>(
    (accumulator, balanceResponse) => {
      const chainId: number = getChainId(balanceResponse);

      if (isPvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
        // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
        const accountKey = `P-${balanceResponse.id}`;
        accumulator[chainId] ??= {};
        accumulator[chainId][accountKey] = merge(
          accumulator[chainId][accountKey] ?? {},
          balanceResponse.balances.categories,
          { nativeTokenBalance: balanceResponse.balances.nativeTokenBalance },
        );
        return accumulator;
      }

      if (isAvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
        // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
        const accountKey = `X-${balanceResponse.id}`;
        accumulator[chainId] ??= {};
        accumulator[chainId][accountKey] = merge(
          accumulator[chainId][accountKey] ?? {},
          balanceResponse.balances.categories,
          { nativeTokenBalance: balanceResponse.balances.nativeTokenBalance },
        );
        return accumulator;
      }

      if (isCorethGetBalancesResponse(balanceResponse) && chainId === 0) {
        const mainNetC = AVALANCHE_BLOCKCHAIN_IDS.MAINNET_C;
        const accountKey = `C-${balanceResponse.id}`;
        accumulator[mainNetC] ??= {};
        accumulator[mainNetC][accountKey] = merge(
          accumulator[mainNetC][accountKey] ?? {},
          balanceResponse.balances.categories,
        );
        return accumulator;
      }

      return accumulator;
    },
    {},
  );
};
