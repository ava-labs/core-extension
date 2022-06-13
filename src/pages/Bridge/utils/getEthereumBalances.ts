import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { Assets } from '@avalabs/bridge-sdk';
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
  request: (message: Omit<ExtensionConnectionMessage<any>, 'id'>) => Promise<{
    [symbol: string]: { balance: string; logoUri?: string } | undefined;
  }>,
  assets: Assets,
  account: string,
  deprecated: boolean
): Promise<AssetBalance[]> {
  const ethereumBalancesBySymbol = await request({
    method: ExtensionRequest.BRIDGE_GET_ETH_BALANCES,
    params: [assets, account, deprecated],
  });

  return Object.entries(assets).map(([symbol, asset]) => {
    const { balance: balanceStr, logoUri } =
      ethereumBalancesBySymbol[symbol] || {};
    const balance = balanceStr ? new Big(balanceStr) : undefined;

    return { symbol, asset, balance, logoUri };
  });
}
