import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { NetworkService } from '../../network/NetworkService';
import { AccountsService } from '../../accounts/AccountsService';
import { injectable } from 'tsyringe';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';

@injectable()
export class MetamaskGetProviderState extends DAppRequestHandler {
  methods = [DAppProviderRequest.INIT_DAPP_STATE];

  constructor(
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {
    super();
  }

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
