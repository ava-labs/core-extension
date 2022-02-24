import { Big, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import {
  Asset,
  AssetType,
  Blockchain,
  ERC20Asset,
  useAssets,
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
 * Get the balance of a bridge supported asset for the given blockchain.
 */
export function useAssetBalance(
  symbol: string | undefined,
  blockchain: Blockchain
): AssetBalance | undefined {
  const { request } = useConnectionContext();
  const [ethBalance, setEthBalance] = useState<AssetBalance>();
  const assets = useAssets(blockchain);
  const asset = symbol && assets[symbol];
  const { addresses, erc20Tokens } = useWalletContext();

  // TODO update this when adding support for /convert
  const showDeprecated = false;

  const avalancheBalance = useMemo(() => {
    if (
      asset &&
      asset.assetType === AssetType.ERC20 &&
      blockchain === Blockchain.AVALANCHE
    ) {
      return getAvalancheBalance(asset, erc20Tokens);
    }
  }, [asset, blockchain, erc20Tokens]);

  // fetch balance from Ethereum
  useEffect(() => {
    if (!asset || blockchain !== Blockchain.ETHEREUM) return;

    (async function getBalances() {
      const balance = await getEthereumBalance(
        request,
        asset,
        addresses.addrC,
        showDeprecated
      );

      setEthBalance(balance);
    })();
  }, [addresses.addrC, asset, blockchain, request, showDeprecated]);

  const assetBalance =
    blockchain === Blockchain.AVALANCHE ? avalancheBalance : ethBalance;

  return assetBalance;
}

function getAvalancheBalance(
  asset: ERC20Asset,
  erc20Tokens: ERC20WithBalance[]
): AssetBalance {
  const erc20TokensByAddress = erc20Tokens.reduce<{
    [address: string]: ERC20WithBalance;
  }>((tokens, token) => {
    // Need to convert the keys to lowercase because they are mixed case, and this messes up or comparison function
    tokens[token.address.toLowerCase()] = token;
    return tokens;
  }, {});

  const symbol = asset.symbol;
  const token = erc20TokensByAddress[asset.wrappedContractAddress];
  const balance = token && bnToBig(token.balance, token.denomination);

  return { symbol, asset, balance };
}

async function getEthereumBalance(
  request: (
    message: Omit<ExtensionConnectionMessage<any>, 'id'>
  ) => Promise<string | undefined>,
  asset: Asset,
  account: string,
  deprecated: boolean
): Promise<AssetBalance> {
  const balanceStr = await request({
    method: ExtensionRequest.BRIDGE_GET_ETH_BALANCE,
    params: [asset, account, deprecated],
  });
  const symbol = asset.symbol;
  const balance = balanceStr ? new Big(balanceStr) : undefined;

  return { symbol, asset, balance };
}
