import { Network } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { Account } from '../../accounts/models';
import { NetworkService } from '../../network/NetworkService';
import { BalanceAggregatorService } from '../BalanceAggregatorService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_BALANCES_UPDATE,
  true,
  [accounts?: Account[], networks?: Network[]] | undefined
>;

@injectable()
export class UpdateBalancesForNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_BALANCES_UPDATE as const;

  constructor(
    private networkBalancesService: BalanceAggregatorService,
    private accountsService: AccountsService,
    private networkSerice: NetworkService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const params = request.params || [];

    // if no account or network is defined default to the currently active one
    const [accounts, networks] = params;

    const accountsToFetch = accounts?.length
      ? accounts
      : this.accountsService.getAccounts();

    if (Object.keys(accountsToFetch).length === 0) {
      return {
        ...request,
        error: 'accounts undefined or empty',
      };
    }

    const networksToFetch = networks?.length
      ? networks
      : Object.values(await this.networkSerice.activeNetworks.promisify());
    if (Object.keys(networksToFetch).length === 0) {
      return {
        ...request,
        error: 'networks undefined or empty',
      };
    }

    this.networkBalancesService.updateBalancesForNetworks(
      networksToFetch,
      accountsToFetch
    );

    /**
     * We dont return the balances here, the above kicks off an async event that is then
     * emitted out to the UI once all balances have been obtained for a given account and network.
     *
     * So we are just returning true here to indicate we have kicked off this process
     */
    return {
      ...request,
      result: true,
    };
  };
}
