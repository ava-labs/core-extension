import { Assets, Blockchain, fetchTokenBalances } from '@avalabs/bridge-sdk';
import { network$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { firstValueFrom } from 'rxjs';
import { getEthereumProvider } from '../getEthereumProvider';

async function getEthereumBalances(request: ExtensionConnectionMessage) {
  const [assets, account, deprecated] = (request.params || []) as [
    assets: Assets,
    account: string,
    deprecated: boolean
  ];

  const network = await firstValueFrom(network$);
  const provider = getEthereumProvider(network);
  const ethereumBalancesBySymbol = await fetchTokenBalances(
    assets,
    Blockchain.ETHEREUM,
    provider,
    account,
    deprecated
  );

  const balances: Record<string, Big> = {};

  for (const symbol in assets) {
    balances[symbol] = ethereumBalancesBySymbol?.[symbol];
  }

  return {
    ...request,
    result: balances,
  };
}

export const GetEthereumBalancesRequest: [
  ExtensionRequest,
  ConnectionRequestHandler<Record<string, Big>>
] = [ExtensionRequest.BRIDGE_GET_ETH_BALANCES, getEthereumBalances];
