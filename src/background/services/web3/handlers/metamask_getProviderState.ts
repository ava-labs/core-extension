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
    return {
      ...request,
      result: {
        isUnlocked: false,
        networkVersion: 'avax',
        accounts: [],
        chainId: this.networkService.activeNetwork?.chainId,
      },
    };
  };

  handleAuthenticated = async (request) => {
    return {
      ...request,
      result: {
        isUnlocked: true,
        chainId: this.networkService.activeNetwork?.chainId,
        networkVersion: 'avax',
        accounts: this.accountsService.activeAccount
          ? [this.accountsService.activeAccount.addressC]
          : [],
      },
    };
  };
}
