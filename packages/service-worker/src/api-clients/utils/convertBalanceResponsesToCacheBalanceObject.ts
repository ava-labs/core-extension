import { AVALANCHE_BLOCKCHAIN_IDS, caipToChainId } from '@core/common';
import { Balances } from '@core/types';
import { CORE_ETH_CAIP2ID } from '~/api-clients/constants';
import {
  mapAvmTokenBalance,
  mapErc20TokenBalance,
  mapNativeTokenBalance,
  mapPvmTokenBalance,
  mapSplTokenBalance,
} from '~/api-clients/mappers';
import { BalanceResponse } from '~/api-clients/types';
import {
  isAvmGetBalancesResponse,
  isBtcGetBalancesResponse,
  isCorethGetBalancesResponse,
  isEvmGetBalancesResponse,
  isPvmGetBalancesResponse,
  isSvmGetBalancesResponse,
} from './type-guards';

export const convertBalanceResponsesToCacheBalanceObject = (
  balanceResponses: BalanceResponse[],
): Balances => {
  return balanceResponses.reduce<Balances>((accumulator, balanceResponse) => {
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

    if (isEvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      const tokenBalanceMapper = mapErc20TokenBalance(chainId);

      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [balanceResponse.id]: {
            ...(accumulator[chainId]?.[balanceResponse.id] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
            ...balanceResponse.balances.erc20TokenBalances.reduce(
              (acc, tokenBalance) => {
                const mappedTokenBalance = tokenBalanceMapper(tokenBalance);

                if (!mappedTokenBalance) {
                  return acc;
                }
                return {
                  ...acc,
                  [tokenBalance.address]: mappedTokenBalance,
                };
              },
              {},
            ),
          },
        },
      };
    }

    if (isPvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
      const accountKey = `P-${balanceResponse.id}`;
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [accountKey]: {
            ...(accumulator[chainId]?.[accountKey] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapPvmTokenBalance(balanceResponse),
          },
        },
      };
    }

    if (isAvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
      const accountKey = `X-${balanceResponse.id}`;
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [accountKey]: {
            ...(accumulator[chainId]?.[accountKey] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapAvmTokenBalance(balanceResponse),
          },
        },
      };
    }

    if (isBtcGetBalancesResponse(balanceResponse) && chainId !== 0) {
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [balanceResponse.id]: {
            ...(accumulator[chainId]?.[balanceResponse.id] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
          },
        },
      };
    }

    if (isSvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      return {
        ...accumulator,
        [chainId]: {
          ...(accumulator[chainId] ?? {}),
          [balanceResponse.id]: {
            ...(accumulator[chainId]?.[balanceResponse.id] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
            ...balanceResponse.balances.splTokenBalances.reduce(
              (acc, tokenBalance) => {
                const mappedTokenBalance = mapSplTokenBalance(tokenBalance);

                if (!mappedTokenBalance) {
                  return acc;
                }
                return {
                  ...acc,
                  [tokenBalance.address]: mappedTokenBalance,
                };
              },
              {},
            ),
          },
        },
      };
    }

    if (isCorethGetBalancesResponse(balanceResponse) && chainId === 0) {
      const mainNetC = AVALANCHE_BLOCKCHAIN_IDS.MAINNET_C;
      const accountKey = `C-${balanceResponse.id}`;
      return {
        ...accumulator,
        [mainNetC]: {
          ...(accumulator[mainNetC] ?? {}),
          [accountKey]: {
            ...(accumulator[mainNetC]?.[accountKey] ?? {}),
            [balanceResponse.balances.nativeTokenBalance.symbol]:
              mapNativeTokenBalance(
                balanceResponse.balances.nativeTokenBalance,
              ),
            categories: {
              ...(accumulator[mainNetC]?.[accountKey]?.categories ?? {}),
              ...balanceResponse.balances.categories,
            },
          },
        },
      } as Balances;
    }

    return accumulator;
  }, {});
};
