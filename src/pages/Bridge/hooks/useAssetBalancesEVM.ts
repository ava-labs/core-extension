import {
  Asset,
  Blockchain,
  useBridgeSDK,
  useGetTokenSymbolOnNetwork,
} from '@avalabs/bridge-sdk';
import { getBalances } from '../utils/getBalances';
import { AssetBalance } from '../models';
import { useMemo } from 'react';
import { useBridgeAvalancheTokens } from './useBridgeAvalancheTokens';
import { useBridgeEthereumTokens } from './useBridgeEthereumTokens';

/**
 * Get for the current chain.
 * Get a list of bridge supported assets with the balances of the current blockchain.
 * The list is sorted by balance.
 */
export function useAssetBalancesEVM(
  chain: Blockchain.AVALANCHE | Blockchain.ETHEREUM,
  asset?: Asset
): {
  assetsWithBalances: AssetBalance[];
} {
  const { avalancheAssets, ethereumAssets, currentBlockchain } = useBridgeSDK();

  const avalancheTokens = useBridgeAvalancheTokens();
  const ethereumTokens = useBridgeEthereumTokens();

  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();

  const tokens =
    chain === Blockchain.ETHEREUM ? ethereumTokens : avalancheTokens;

  // For balances on the Avalanche side, for all bridge assets on avalanche
  const balances = useMemo(() => {
    const isAvalanche =
      chain === Blockchain.AVALANCHE ||
      currentBlockchain === Blockchain.AVALANCHE;
    const isEthereum =
      chain === Blockchain.ETHEREUM ||
      currentBlockchain === Blockchain.ETHEREUM;
    if (!isAvalanche && !isEthereum) {
      return [];
    }
    const assets = asset
      ? { [asset.symbol]: asset }
      : isAvalanche
      ? avalancheAssets
      : ethereumAssets;
    return getBalances(assets, tokens).map((token) => {
      return {
        ...token,
        symbolOnNetwork: getTokenSymbolOnNetwork(token.symbol, chain),
      };
    });
  }, [
    chain,
    currentBlockchain,
    asset,
    avalancheAssets,
    ethereumAssets,
    tokens,
    getTokenSymbolOnNetwork,
  ]);

  const assetsWithBalances = balances.sort(
    (asset1, asset2) => asset2.balance?.cmp(asset1.balance || 0) || 0
  );

  return { assetsWithBalances };
}
