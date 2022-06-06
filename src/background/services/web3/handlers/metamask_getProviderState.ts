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
        chainId: `0x${activeNetwork?.chainId.toString(16)}`,
        networkVersion: `${activeNetwork?.chainId}`,
        accounts: [],
      },
    };
  };

  handleAuthenticated = async (request) => {
    const activeNetwork = await this.networkService.activeNetwork.promisify();
    return {
      ...request,
      result: {
        isUnlocked: true,
        chainId: `0x${activeNetwork?.chainId.toString(16)}`,
        networkVersion: `${activeNetwork?.chainId}`,
        accounts: this.accountsService.activeAccount
          ? [this.accountsService.activeAccount.addressC]
          : [],
      },
    };
  };
}
