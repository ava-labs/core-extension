import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { Account } from '../../accounts/models';
import { NetworkService } from '../../network/NetworkService';
import { BalanceAggregatorService } from '../BalanceAggregatorService';
import { Balances } from '../models';
import { caipToChainId } from '@src/utils/caipConversion';
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
