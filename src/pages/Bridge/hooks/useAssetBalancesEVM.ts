import {
  Blockchain,
  useBridgeSDK,
  useGetTokenSymbolOnNetwork,
} from '@avalabs/bridge-sdk';
import { getAvalancheBalances } from '../utils/getAvalancheBalances';
import { AssetBalance } from '../models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useMemo, useState } from 'react';
import { getEthereumBalances } from '../utils/getEthereumBalances';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBridgeAvalancheTokens } from './useBridgeAvalancheTokens';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

/**
 * Get for the current chain.
 * Get a list of bridge supported assets with the balances of the current blockchain.
 * The list is sorted by balance.
 */
export function useAssetBalancesEVM(
  chain: Blockchain.AVALANCHE | Blockchain.ETHEREUM
): {
  assetsWithBalances: AssetBalance[];
  loading: boolean;
} {
  const { request } = useConnectionContext();
  const { avalancheAssets, ethereumAssets, currentBlockchain } = useBridgeSDK();
  const { activeAccount } = useAccountsContext();
  const tokens = useBridgeAvalancheTokens();
  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();
  const { network } = useNetworkContext();

  const [loading, setLoading] = useState(false);
  const [ethBalances, setEthBalances] = useState<AssetBalance[]>([]);

  // TODO update this when adding support for /convert
  const showDeprecated = false;

  // For balances on the Avalanche side, for all bridge assets on avalanche
  const avalancheBalances = useMemo(() => {
    if (
      chain !== Blockchain.AVALANCHE ||
      currentBlockchain !== Blockchain.AVALANCHE
    )
      return [];
    return getAvalancheBalances(avalancheAssets, tokens).map((token) => ({
      ...token,
      symbolOnNetwork: getTokenSymbolOnNetwork(
        token.symbol,
        Blockchain.AVALANCHE
      ),
    }));
  }, [
    chain,
    currentBlockchain,
    avalancheAssets,
    tokens,
    getTokenSymbolOnNetwork,
  ]);

  // Fetch balances from Ethereum (including native)
  useEffect(() => {
    if (
      !network ||
      !activeAccount?.addressC ||
      chain !== Blockchain.ETHEREUM ||
      currentBlockchain !== Blockchain.ETHEREUM
    )
      return;

    setLoading(true);

    (async function getBalances() {
      const balances = await getEthereumBalances(
        request,
        ethereumAssets,
        activeAccount?.addressC,
        showDeprecated
      );
      setLoading(false);
      setEthBalances(balances);
    })();
  }, [
    activeAccount?.addressC,
    ethereumAssets,
    chain,
    request,
    showDeprecated,
    currentBlockchain,
    network, // update balances when the network changes
  ]);

  const assetsWithBalances = (
    chain === Blockchain.AVALANCHE
      ? avalancheBalances
      : chain === Blockchain.ETHEREUM
      ? ethBalances
      : []
  ).sort((asset1, asset2) => asset2.balance?.cmp(asset1.balance || 0) || 0);

  return { assetsWithBalances, loading };
}
