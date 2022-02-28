import { Big, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import {
  Assets,
  AssetType,
  Blockchain,
  ERC20Asset,
  useAssets,
  useBridgeSDK,
} from '@avalabs/bridge-sdk';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import {
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { AssetBalance } from '@src/pages/Bridge/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useEffect, useMemo, useState } from 'react';

/**
 * Get a list of bridge supported assets with the balances of the current blockchain.
 * The list is sorted by balance.
 */
export function useAssetBalances(): {
  assetsWithBalances: AssetBalance[];
  loading: boolean;
} {
  const { request } = useConnectionContext();
  const [loading, setLoading] = useState(false);
  const [ethBalances, setEthBalances] = useState<AssetBalance[]>([]);
  const { currentBlockchain } = useBridgeSDK();
  const assets = useAssets(currentBlockchain);
  const { addresses, erc20Tokens } = useWalletContext();

  // TODO update this when adding support for /convert
  const showDeprecated = false;

  const avalancheBalances = useMemo(() => {
    if (currentBlockchain !== Blockchain.AVALANCHE) return [];
    return getAvalancheBalances(assets, erc20Tokens);
  }, [assets, currentBlockchain, erc20Tokens]);

  // fetch balances from Ethereum
  useEffect(() => {
    if (currentBlockchain !== Blockchain.ETHEREUM) return;
    setLoading(true);

    (async function getBalances() {
      const balances = await getEthereumBalances(
        request,
        assets,
        addresses.addrC,
        showDeprecated
      );

      setLoading(false);
      setEthBalances(balances);
    })();
  }, [addresses.addrC, assets, currentBlockchain, request, showDeprecated]);

  const assetsWithBalances = (
    currentBlockchain === Blockchain.AVALANCHE ? avalancheBalances : ethBalances
  ).sort((asset1, asset2) => asset2.balance?.cmp(asset1.balance || 0) || 0);

  return { assetsWithBalances, loading };
}

function getAvalancheBalances(
  assets: Assets,
  erc20Tokens: ERC20WithBalance[]
): AssetBalance[] {
  const erc20TokensByAddress = erc20Tokens.reduce<{
    [address: string]: ERC20WithBalance;
  }>((tokens, token) => {
    // Need to convert the keys to lowercase because they are mixed case, and this messes up or comparison function
    tokens[token.address.toLowerCase()] = token;
    return tokens;
  }, {});

  return Object.values(assets)
    .filter(
      // assets won't include a NativeAsset (i.e. AVAX) so we're ignoring it
      (asset): asset is ERC20Asset => asset.assetType === AssetType.ERC20
    )
    .map((asset) => {
      const symbol = asset.symbol;
      const token = erc20TokensByAddress[asset.wrappedContractAddress];
      const balance = token && bnToBig(token.balance, token.denomination);

      return { symbol, asset, balance };
    });
}

async function getEthereumBalances(
  request: (
    message: Omit<ExtensionConnectionMessage<any>, 'id'>
  ) => Promise<Record<string, string | undefined>>,
  assets: Assets,
  account: string,
  deprecated: boolean
): Promise<AssetBalance[]> {
  const ethereumBalancesBySymbol = await request({
    method: ExtensionRequest.BRIDGE_GET_ETH_BALANCES,
    params: [assets, account, deprecated],
  });

  return Object.entries(assets).map(([symbol, asset]) => {
    const balanceStr = ethereumBalancesBySymbol?.[symbol];
    const balance = balanceStr ? new Big(balanceStr) : undefined;

    return { symbol, asset, balance };
  });
}
