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
    const activeNetwork = this.networkService.activeNetwork;
    return {
      ...request,
      result: {
        isUnlocked: false,
        chainId: activeNetwork?.chainId
          ? `0x${activeNetwork?.chainId.toString(16)}`
          : '0x0',
        networkVersion: activeNetwork?.chainId
          ? `${activeNetwork?.chainId}`
          : 'loading',
        accounts: [],
      },
    };
  };

  handleAuthenticated = async (request) => {
    const activeNetwork = this.networkService.activeNetwork;
    return {
      ...request,
      result: {
        isUnlocked: true,
        chainId: activeNetwork?.chainId
          ? `0x${activeNetwork?.chainId.toString(16)}`
          : '0x0',
        networkVersion: activeNetwork?.chainId
          ? `${activeNetwork?.chainId}`
          : 'loading',
        accounts: this.accountsService.activeAccount
          ? [this.accountsService.activeAccount.addressC]
          : [],
      },
    };
  };
}
