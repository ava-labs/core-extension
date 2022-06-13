import {
  Asset,
  AssetType,
  Blockchain,
  useGetTokenSymbolOnNetwork,
} from '@avalabs/bridge-sdk';
import {
  AssetBalance,
  BALANCE_REFRESH_INTERVAL,
} from '@src/pages/Bridge/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from '@src/hooks/useInterval';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBridgeAvalancheTokens } from './useBridgeAvalancheTokens';
import { getEthereumBalances } from '../utils/getEthereumBalances';
import { getAvalancheBalances } from '../utils/getAvalancheBalances';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

/**
 * Get the balance of a bridge supported asset for the given blockchain.
 */
export function useAssetBalanceEVM(
  asset: Asset | undefined,
  source: Blockchain
): AssetBalance | undefined {
  const { request } = useConnectionContext();
  const [ethBalance, setEthBalance] = useState<AssetBalance>();
  const tokens = useBridgeAvalancheTokens();
  const { getTokenSymbolOnNetwork } = useGetTokenSymbolOnNetwork();
  const { activeAccount } = useAccountsContext();
  const refetchInterval = useInterval(BALANCE_REFRESH_INTERVAL);
  const { network } = useNetworkContext();

  // TODO update this when adding support for /convert
  const showDeprecated = false;

  const avalancheBalance = useMemo(() => {
    if (
      asset &&
      (asset.assetType === AssetType.ERC20 ||
        asset.assetType === AssetType.BTC) &&
      source === Blockchain.AVALANCHE
    ) {
      return getAvalancheBalances(
        { [asset.symbol]: asset },
        tokens
      ).map<AssetBalance>((token) => ({
        ...token,
        symbolOnNetwork: getTokenSymbolOnNetwork(
          token.symbol,
          Blockchain.AVALANCHE
        ),
      }))[0];
    }
  }, [asset, getTokenSymbolOnNetwork, source, tokens]);

  // fetch balance from Ethereum
  useEffect(() => {
    if (
      !network ||
      !activeAccount?.addressC ||
      !asset ||
      source !== Blockchain.ETHEREUM
    ) {
      setEthBalance(undefined);
      return;
    }

    (async function getBalances() {
      const balances = await getEthereumBalances(
        request,
        { [asset.symbol]: asset },
        activeAccount.addressC,
        showDeprecated
      );

      setEthBalance(balances[0]);
    })();
  }, [
    activeAccount?.addressC,
    asset,
    source,
    request,
    showDeprecated,
    // refetchInterval is here to ensure the balance is updated periodically
    refetchInterval,
    network, // update balance when the network changes
  ]);

  return source === Blockchain.AVALANCHE
    ? avalancheBalance
    : source === Blockchain.ETHEREUM
    ? ethBalance
    : undefined;
}
