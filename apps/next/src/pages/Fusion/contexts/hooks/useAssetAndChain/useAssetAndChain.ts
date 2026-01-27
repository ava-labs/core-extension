import { useMemo } from 'react';
import { Asset } from '@avalabs/unified-asset-transfer';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { useNetworkContext } from '@core/ui';

import { buildChain } from './lib/buildChain';
import { buildAsset } from './lib/buildAsset';
import { FungibleTokenBalance } from '@core/types';

export const useAssetAndChain = (token?: FungibleTokenBalance) => {
  const { getNetwork } = useNetworkContext();

  const tokenAddress = !token
    ? undefined
    : token.type === VmTokenType.NATIVE
      ? undefined
      : token.address;

  const chain = useMemo(
    () =>
      token?.coreChainId
        ? buildChain(token.coreChainId, getNetwork)
        : undefined,
    [token?.coreChainId, getNetwork],
  );

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
    );
  }, [
    token?.assetType,
    token?.coreChainId,
    token?.name,
    token?.symbol,
    token?.decimals,
    tokenAddress,
  ]);

  return {
    asset,
    chain,
  };
};
