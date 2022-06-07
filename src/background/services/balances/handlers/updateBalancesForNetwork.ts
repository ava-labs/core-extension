import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { Account } from '../../accounts/models';
import { NetworkService } from '../../network/NetworkService';
import { NetworkBalanceAggregatorService } from '../NetworkBalanceAggregatorService';

@injectable()
export class UpdateBalancesForNetworkHandler
  implements ExtensionRequestHandler
{
  methods = [ExtensionRequest.NETWORK_BALANCES_UPDATE];

  constructor(
    private networkBalancesService: NetworkBalanceAggregatorService,
    private accountsService: AccountsService,
    private networkSerice: NetworkService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params || [];

    // if no account or network is defined default to the currently active one
    const [accounts, networks] = params;

    const accountsToFetch: Account[] = accounts?.length
      ? accounts
      : this.accountsService.getAccounts();

    if (Object.keys(accountsToFetch).length === 0) {
      return {
        ...request,
        error: 'accounts undefined or empty',
      };
    }

    const networksToFetch: Network[] = networks?.length
      ? networks
      : Object.values(await this.networkSerice.activeNetworks.promisify());
    if (Object.keys(networksToFetch).length === 0) {
      return {
        ...request,
        error: 'networks undefined or empty',
      };
    }

    const isBTCInUpdates = networksToFetch.some(
      (net) => net.vmName === NetworkVMType.BITCOIN
    );

    const isEVMInUpdates = networksToFetch.some(
      (net) => net.vmName === NetworkVMType.EVM
    );

    if (isBTCInUpdates) {
      this.networkBalancesService.updateBTCBalancesForNetwork(accountsToFetch);
    }

    if (isEVMInUpdates) {
      this.networkBalancesService.updateEVMBalancesForNetworks(
        networksToFetch,
        accountsToFetch
      );
    }

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
