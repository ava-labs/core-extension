import {
  Asset,
  AssetType,
  BitcoinConfigAsset,
  Blockchain,
  EthereumConfigAsset,
} from '@avalabs/bridge-sdk';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import {
  AssetBalance,
  BALANCE_REFRESH_INTERVAL,
} from '@src/pages/Bridge/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useMemo, useState } from 'react';
import { useInterval } from '@src/hooks/useInterval';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { bnToBig } from '@avalabs/utils-sdk';
import {
  NetworkContractTokenWithBalance,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import Big from 'big.js';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

/**
 * Get the balance of a bridge supported asset for the given blockchain.
 */
export function useAssetBalanceEVM(
  asset: Asset | undefined,
  source: Blockchain
): AssetBalance | undefined {
  const { request } = useConnectionContext();
  const [ethBalance, setEthBalance] = useState<Big>();
  const tokens = useTokensWithBalances(true);
  const { activeAccount } = useAccountsContext();
  const refetchInterval = useInterval(BALANCE_REFRESH_INTERVAL);

  // TODO update this when adding support for /convert
  const showDeprecated = false;

  const avalancheBalance = useMemo(() => {
    if (
      asset &&
      (asset.assetType === AssetType.ERC20 ||
        asset.assetType === AssetType.BTC) &&
      source === Blockchain.AVALANCHE
    ) {
      return getAvalancheBalance(asset, tokens);
    }
  }, [asset, source, tokens]);

  // fetch balance from Ethereum
  useEffect(() => {
    if (!activeAccount?.addressC || !asset || source !== Blockchain.ETHEREUM) {
      setEthBalance(undefined);
      return;
    }

    (async function getBalances() {
      const balance = await getEthereumBalance(
        request,
        asset,
        activeAccount.addressC,
        showDeprecated
      );

      setEthBalance(balance);
    })();
  }, [
    activeAccount?.addressC,
    asset,
    source,
    request,
    showDeprecated,
    // refetchInterval is here to ensure the balance is updated periodically
    refetchInterval,
  ]);

  const balance =
    source === Blockchain.AVALANCHE
      ? avalancheBalance
      : source === Blockchain.ETHEREUM
      ? ethBalance
      : undefined;

  return asset && { symbol: asset.symbol, asset, balance };
}

function getAvalancheBalance(
  asset: EthereumConfigAsset | BitcoinConfigAsset,
  erc20Tokens: TokenWithBalance[]
): Big {
  const erc20TokensByAddress = erc20Tokens.reduce<{
    [address: string]: NetworkContractTokenWithBalance;
  }>((tokens, token) => {
    if (!token.isERC20) {
      return tokens;
    }
    // Need to convert the keys to lowercase because they are mixed case, and this messes up or comparison function
    tokens[token.address.toLowerCase()] = token;
    return tokens;
  }, {});

  const token = erc20TokensByAddress[asset.wrappedContractAddress];
  return token && bnToBig(token.balance, token.decimals);
}

async function getEthereumBalance(
  request: (
    message: Omit<ExtensionConnectionMessage<any>, 'id'>
  ) => Promise<string | undefined>,
  asset: Asset,
  account: string,
  deprecated: boolean
): Promise<Big | undefined> {
  const balanceStr = await request({
    method: ExtensionRequest.BRIDGE_GET_ETH_BALANCE,
    params: [asset, account, deprecated],
  });
  return balanceStr ? new Big(balanceStr) : undefined;
}
