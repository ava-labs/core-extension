import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { NetworkService } from '../../network/NetworkService';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';

@injectable()
export class MetamaskGetProviderState implements DAppRequestHandler {
  methods = [DAppProviderRequest.INIT_DAPP_STATE];

  constructor(
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {}

  handleUnauthenticated = async (request) => {
    const activeNetwork = await this.networkService.activeNetwork.promisify();
    return {
      ...request,
      result: {
        isUnlocked: false,
        // this needs to be changed to the network?
        networkVersion: 'avax',
        accounts: [],
        chainId: activeNetwork?.chainId,
      },
    };
  };

  handleAuthenticated = async (request) => {
    const activeNetwork = await this.networkService.activeNetwork.promisify();
    return {
      ...request,
      result: {
        isUnlocked: true,
        chainId: activeNetwork?.chainId,
        // this needs to be changed to the network?
        networkVersion: 'avax',
        accounts: this.accountsService.activeAccount
          ? [this.accountsService.activeAccount.addressC]
          : [],
      },
    };
  };
}
