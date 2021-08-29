import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { permissions$ } from '../../permissions/permissions';
import { domainHasAccountsPermissions } from '../../permissions/utils/domainHasAccountPermissions';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$ } from '../../wallet/wallet';

/**
 * This is called right away by dapps to see if its already connected
 *
 * @param data the rpc request
 * @returns an array of accounts the dapp has permissions for
 */
export async function eth_accounts(data: ExtensionConnectionMessage) {
  const walletResult = await firstValueFrom(wallet$);

  if (!walletResult) {
    return {
      ...data,
      error: new Error('wallet undefined'),
    };
  }
  const currentPermissions = await firstValueFrom(permissions$);

  return {
    ...data,
    result: domainHasAccountsPermissions(data.domain!, currentPermissions)
      ? getAccountsFromWallet(walletResult)
      : [],
  };
}

export const EthAccountsRequest: [
  DAppProviderRequest,
  ConnectionRequestHandler
] = [DAppProviderRequest.ETH_ACCOUNTS, eth_accounts];