import { Assets } from '@avalabs/bridge-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeGetEthereumBalancesHandler } from '@src/background/services/bridge/handlers/getEthereumBalances';
import { ConnectionContextType } from '@src/contexts/ConnectionProvider';
import { AssetBalance } from '@src/pages/Bridge/models';
import Big from 'big.js';

/**
 *
 * @param request
 * @param assets
 * @param account
 * @param deprecated
 */
export async function getEthereumBalances(
  request: ConnectionContextType['request'],
  assets: Assets,
  account: string,
  deprecated: boolean
): Promise<AssetBalance[]> {
  const ethereumBalancesBySymbol =
    await request<BridgeGetEthereumBalancesHandler>({
      method: ExtensionRequest.BRIDGE_GET_ETH_BALANCES,
      params: [assets, account, deprecated],
    });

  return Object.entries(assets).map(([symbol, asset]) => {
    const {
      balance: balanceStr,
      logoUri,
      price,
    } = ethereumBalancesBySymbol[symbol] || {};
    const balance = balanceStr ? new Big(balanceStr) : undefined;

    return { symbol, asset, balance, logoUri, price };
  });
}
