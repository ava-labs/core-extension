import { type Asset, type Chain, TokenType } from '@avalabs/fusion-sdk';

import {
  caipToChainId,
  isAvalancheChainId,
  isPchainNetworkId,
  isXchainNetworkId,
} from '@core/common';

export const isAvalancheCctRoute = ({
  sourceAsset,
  sourceChain,
  targetAsset,
  targetChain,
}: {
  sourceAsset?: Asset;
  sourceChain?: Chain;
  targetAsset?: Asset;
  targetChain?: Chain;
}) => {
  if (
    !sourceAsset ||
    !sourceChain ||
    !targetAsset ||
    !targetChain ||
    sourceChain.chainId === targetChain.chainId
  ) {
    return false;
  }

  return (
    isAvalanchePrimaryChain(sourceChain) &&
    isAvalanchePrimaryChain(targetChain) &&
    sourceAsset.type === TokenType.NATIVE &&
    targetAsset.type === TokenType.NATIVE
  );
};

const isAvalanchePrimaryChain = (chain: Chain) => {
  const chainId = caipToChainId(chain.chainId);

  return (
    isAvalancheChainId(chainId) ||
    isPchainNetworkId(chainId) ||
    isXchainNetworkId(chainId)
  );
};
