import { Asset, Blockchain, fetchTokenBalances } from '@avalabs/bridge-sdk';
import { network$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { getEthereumProvider } from '../getEthereumProvider';
import { Big } from '@avalabs/avalanche-wallet-sdk';

async function getEthereumBalance(request: ExtensionConnectionMessage) {
  const [asset, account, deprecated] = (request.params || []) as [
    asset: Asset,
    account: string,
    deprecated: boolean
  ];

  const network = await firstValueFrom(network$);
  const provider = getEthereumProvider(network);
  const ethereumBalancesBySymbol = await fetchTokenBalances(
    { [asset.symbol]: asset },
    Blockchain.ETHEREUM,
    provider,
    account,
    deprecated
  );

  const balance: Big = ethereumBalancesBySymbol?.[asset.symbol];

  return {
    ...request,
    result: balance,
  };
}

export const GetEthereumBalanceRequest: [
  ExtensionRequest,
  ConnectionRequestHandler<Big | undefined>
] = [ExtensionRequest.BRIDGE_GET_ETH_BALANCE, getEthereumBalance];
