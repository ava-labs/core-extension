import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { NetworkService } from '../../network/NetworkService';
import { NFTBalancesService } from '../nft/NFTBalancesService';

@injectable()
export class GetNftBalancesHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NFT_BALANCES_GET];

  constructor(
    private nftBalancesService: NFTBalancesService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const currentNetwork = await this.networkService.activeNetwork.promisify();
    if (!currentNetwork) {
      return {
        ...request,
        error: 'No network found',
      };
    }
    if (!this.accountsService.activeAccount?.addressC) {
      return {
        ...request,
        error: 'Account not found',
      };
    }

    try {
      return {
        ...request,
        result: await this.nftBalancesService.getNftBalances(
          this.accountsService.activeAccount.addressC, // using evm address directly since btc will never support nfts
          currentNetwork
        ),
      };
    } catch (e) {
      return {
        ...request,
        error: (e as any).toString(),
      };
    }
  };
}
