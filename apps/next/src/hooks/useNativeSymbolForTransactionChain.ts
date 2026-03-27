import { useMemo } from 'react';
import { TokenType } from '@avalabs/vm-module-types';
import {
  buildNetworkLookupKeys,
  getEthNativeSymbolForKnownChainId,
} from '@core/common';
import { useNetworkContext, useTokensWithBalances } from '@core/ui';

/**
 * Resolves the native currency symbol for a transaction’s chain using the same
 * sources as approval fee UI: {@link useNativeToken} → merged token list + balances
 * for that network (see {@link useTokensWithBalances}), then chain metadata, then
 * known ETH-native chain IDs.
 */
export function useNativeSymbolForTransactionChain(
  chainId: string | number | undefined,
): string | undefined {
  const { getNetwork } = useNetworkContext();

  const transactionNetwork = useMemo(() => {
    if (chainId === undefined || String(chainId).trim() === '') {
      return undefined;
    }
    for (const key of buildNetworkLookupKeys(chainId)) {
      const network = getNetwork(key);
      if (network) {
        return network;
      }
    }
    return undefined;
  }, [getNetwork, chainId]);

  const tokens = useTokensWithBalances({
    network: transactionNetwork,
    forceShowTokensWithoutBalances: true,
    restrictToExplicitNetwork: true,
  });

  const fromTokenList = useMemo(() => {
    const native = tokens.find((t) => t.type === TokenType.NATIVE);
    return native?.symbol?.trim();
  }, [tokens]);

  return useMemo(() => {
    const fromConfig = transactionNetwork?.networkToken?.symbol?.trim();
    if (fromConfig) {
      return fromConfig;
    }

    if (fromTokenList) {
      return fromTokenList;
    }

    if (chainId === undefined || String(chainId).trim() === '') {
      return undefined;
    }
    for (const key of buildNetworkLookupKeys(chainId)) {
      if (typeof key === 'number') {
        const fallback = getEthNativeSymbolForKnownChainId(key);
        if (fallback) {
          return fallback;
        }
      }
    }
    return undefined;
  }, [fromTokenList, transactionNetwork, chainId]);
}
