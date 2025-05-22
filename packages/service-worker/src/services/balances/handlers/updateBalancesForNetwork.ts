import {
  Account,
  Balances,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '~/services/accounts/AccountsService';
import { NetworkService } from '~/services/network/NetworkService';
import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';
import { caipToChainId } from '@core/common';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_BALANCES_UPDATE,
  { tokens: Balances; nfts: Balances<NftTokenWithBalance> },
  [accounts?: Account[], networks?: number[]] | undefined
>;

@injectable()
export class UpdateBalancesForNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_BALANCES_UPDATE as const;

  constructor(
    private networkBalancesService: BalanceAggregatorService,
    private accountsService: AccountsService,
    private networkSerice: NetworkService,
  ) {}

  async #getDefaultNetworksToFetch(activeChainId: number) {
    const favoriteNetworks = await this.networkSerice.getFavoriteNetworks();

    return [...(activeChainId ? [activeChainId] : []), ...favoriteNetworks];
  }

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const params = request.params || [];

    // if no account or network is defined default to the currently active one
    const [accounts, networks] = params;

    const accountsToFetch = accounts?.length
      ? accounts
      : this.accountsService.getAccountList();

    if (Object.keys(accountsToFetch).length === 0) {
      return {
        ...request,
        error: 'accounts undefined or empty',
      };
    }

    const networksToFetch = networks?.length
      ? networks
      : await this.#getDefaultNetworksToFetch(caipToChainId(scope));

    if (Object.keys(networksToFetch).length === 0) {
      return {
        ...request,
        error: 'networks undefined or empty',
      };
    }

    try {
      const balances = await this.networkBalancesService.getBalancesForNetworks(
        networksToFetch,
        accountsToFetch,
        [TokenType.NATIVE, TokenType.ERC20],
      );
      return {
        ...request,
        result: balances,
      };
    } catch (err) {
      return {
        ...request,
        error: `error while fetching balances: ${
          (err as unknown as Error).message
        }`,
      };
    }
  };
}
