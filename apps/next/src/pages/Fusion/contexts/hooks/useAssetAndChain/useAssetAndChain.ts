import { useMemo } from 'react';
import { Asset } from '@avalabs/fusion-sdk';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { useNetworkContext } from '@core/ui';

import { buildChain } from './lib/buildChain';
import { buildAsset } from './lib/buildAsset';
import { isHypercoreUsdcIdentity } from '../../../lib/isHypercoreUsdcToken';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

export const useAssetAndChain = (token?: FungibleTokenBalance) => {
  const { getNetwork } = useNetworkContext();

  const tokenAddress = !token
    ? undefined
    : token.type === VmTokenType.NATIVE ||
        token.type === VmTokenType.HYPERCORE_SPOT
      ? undefined
      : token.address;

  const chain = useMemo(
    () =>
      token?.coreChainId
        ? buildChain(token.coreChainId, getNetwork)
        : undefined,
    [token?.coreChainId, getNetwork],
  );

  const isHypercoreUsdc =
    !!token?.coreChainId &&
    token.assetType === 'evm_native' &&
    isHypercoreUsdcIdentity(token.coreChainId, token.symbol);

  const uniqueTokenId = token ? getUniqueTokenId(token) : undefined;

  const asset = useMemo((): Asset | undefined => {
    if (!token?.coreChainId) {
      return undefined;
    }
    return buildAsset(
      token.assetType,
      token.name,
      token.symbol,
      token.decimals,
      tokenAddress,
      token.coreChainId,
    );
    // name is display-only; keying on the id keeps the quoter stable across metadata sources
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uniqueTokenId,
    token?.assetType,
    token?.coreChainId,
    token?.decimals,
    tokenAddress,
    isHypercoreUsdc,
  ]);

  return {
    asset,
    chain,
  };
};
