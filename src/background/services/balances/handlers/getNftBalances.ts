import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { NetworkService } from '../../network/NetworkService';
import { NFT } from '../nft/models';
import { NFTBalancesService } from '../nft/NFTBalancesService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NFT_BALANCES_GET,
  NFT[]
>;

@injectable()
export class GetNftBalancesHandler implements HandlerType {
  method = ExtensionRequest.NFT_BALANCES_GET as const;

  constructor(
    private nftBalancesService: NFTBalancesService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
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
