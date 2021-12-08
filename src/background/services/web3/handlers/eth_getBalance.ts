import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { wallet$ } from '@avalabs/wallet-react-components';

// https://eth.wiki/json-rpc/API#eth_getbalance
export async function eth_getBalance(data: ExtensionConnectionMessage) {
  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...data,
      error: 'wallet undefined',
    };
  }

  return {
    ...data,
    // adding `0x` prefix to indicate the hexadecimal representation
    // without the prefix numbers such as 1234 could be interpreted both decimal or hexadecimal
    // this can result in value differences. e.g: hexadecimal 1234 === 4660 in decimal
    result: `0x${walletResult.getAvaxBalanceC().toString('hex')}`,
  };
}

export const EthGetBalanceRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.ETH_GET_BALANCE, eth_getBalance];
