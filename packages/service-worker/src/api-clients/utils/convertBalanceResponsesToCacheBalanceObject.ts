import { TokenWithBalance } from '@avalabs/vm-module-types';
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

export const convertBalanceResponsesToCacheBalanceObject = (
  balanceResponses: BalanceResponse[],
): Balances => {
  return balanceResponses.reduce<Balances>((accumulator, balanceResponse) => {
    const nativeSymbol = balanceResponse.balances.nativeTokenBalance.symbol;
    const chainId: number = getChainId(balanceResponse);

    if (isEvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      const tokenBalanceMapper = mapErc20TokenBalance(chainId);
      const accountKey = balanceResponse.id;
      accumulator[chainId] ??= {};
      accumulator[chainId][accountKey] ??= {};
      accumulator[chainId][accountKey][nativeSymbol] = mapNativeTokenBalance(
        balanceResponse.balances.nativeTokenBalance,
      );

      balanceResponse.balances.erc20TokenBalances.reduce(
        (acc, tokenBalance) => {
          const mappedTokenBalance = tokenBalanceMapper(tokenBalance);

          if (mappedTokenBalance) {
            acc[tokenBalance.address] = mappedTokenBalance;
          }

          return acc;
        },
        accumulator[chainId][accountKey],
      );

      return accumulator;
    }

    if (isPvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
      const accountKey = `P-${balanceResponse.id}`;
      accumulator[chainId] ??= {};
      accumulator[chainId][accountKey] ??= {};
      accumulator[chainId][accountKey][nativeSymbol] =
        mapPvmTokenBalance(balanceResponse);
      return accumulator;
    }

    if (isAvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      // the id in the response is the walletId we passed in with the addressDetails. For X/P that should be the account address
      const accountKey = `X-${balanceResponse.id}`;
      accumulator[chainId] ??= {};
      accumulator[chainId][accountKey] ??= {};
      accumulator[chainId][accountKey][nativeSymbol] =
        mapAvmTokenBalance(balanceResponse);
      return accumulator;
    }

    if (isBtcGetBalancesResponse(balanceResponse) && chainId !== 0) {
      const accountKey = balanceResponse.id;
      accumulator[chainId] ??= {};
      accumulator[chainId][accountKey] ??= {};
      accumulator[chainId][accountKey][nativeSymbol] = mapNativeTokenBalance(
        balanceResponse.balances.nativeTokenBalance,
      );
      return accumulator;
    }

    if (isSvmGetBalancesResponse(balanceResponse) && chainId !== 0) {
      const accountKey = balanceResponse.id;
      accumulator[chainId] ??= {};
      accumulator[chainId][accountKey] ??= {};
      accumulator[chainId][accountKey][nativeSymbol] = mapNativeTokenBalance(
        balanceResponse.balances.nativeTokenBalance,
      );
      balanceResponse.balances.splTokenBalances.reduce((acc, tokenBalance) => {
        const mappedTokenBalance = mapSplTokenBalance(tokenBalance);

        if (mappedTokenBalance) {
          acc[tokenBalance.address] = mappedTokenBalance;
        }

        return acc;
      }, accumulator[chainId][accountKey]);

      return accumulator;
    }

    if (isCorethGetBalancesResponse(balanceResponse) && chainId === 0) {
      const mainNetC = AVALANCHE_BLOCKCHAIN_IDS.MAINNET_C;
      const accountKey = `C-${balanceResponse.id}`;
      accumulator[mainNetC] ??= {};
      accumulator[mainNetC][accountKey] ??= {};
      accumulator[mainNetC][accountKey][nativeSymbol] = mapNativeTokenBalance(
        balanceResponse.balances.nativeTokenBalance,
      );
      accumulator[mainNetC][accountKey].categories = {
        ...accumulator[mainNetC][accountKey].categories,
        ...(balanceResponse.balances.categories as unknown as TokenWithBalance),
      };

      return accumulator;
    }

    return accumulator;
  }, {});
};
