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

export const convertBalanceResponseToAtomicCacheBalanceObject = (
  balanceResponses: BalanceResponse[],
): AtomicBalances => {
  return balanceResponses.reduce<AtomicBalances>(
    (accumulator, balanceResponse) => {
      let chainId: number = 0;
      try {
        chainId = caipToChainId(balanceResponse.caip2Id);
      } catch (error) {
        // if we are throwing error because of CoreEth, we are ignoring it
        if (
          !(error instanceof Error) ||
          !error.message.includes(CORE_ETH_CAIP2ID)
        ) {
          throw error;
        }
      }

      if (isPvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
        // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
        const accountKey = `P-${balanceResponse.id}`;
        const mergedAccountObject = merge(
          accumulator[chainId]?.[accountKey] ?? {},
          balanceResponse.balances.categories,
        );
        return {
          ...accumulator,
          [chainId]: {
            ...(accumulator[chainId] ?? {}),
            [accountKey]: {
              ...mergedAccountObject,
              nativeTokenBalance: balanceResponse.balances.nativeTokenBalance,
            },
          },
        };
      }

      if (isAvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
        // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
        const accountKey = `X-${balanceResponse.id}`;
        const mergedAccountObject = merge(
          accumulator[chainId]?.[accountKey] ?? {},
          balanceResponse.balances.categories,
        );
        return {
          ...accumulator,
          [chainId]: {
            ...(accumulator[chainId] ?? {}),
            [accountKey]: mergedAccountObject,
          },
        };
      }

      if (isCorethGetBalancesResponse(balanceResponse) && chainId === 0) {
        const mainNetC = AVALANCHE_BLOCKCHAIN_IDS.MAINNET_C;
        const accountKey = `C-${balanceResponse.id}`;
        const mergedAccountObject = merge(
          accumulator[mainNetC]?.[accountKey] ?? {},
          balanceResponse.balances.categories,
        );
        return {
          ...accumulator,
          [mainNetC]: {
            ...(accumulator[mainNetC] ?? {}),
            [accountKey]: mergedAccountObject,
          },
        };
      }

      return accumulator;
    },
    {},
  );
};
