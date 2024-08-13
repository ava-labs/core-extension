import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { NetworkService } from '../../network/NetworkService';
import { NftBalanceResponse, NftPageTokens, TokenType } from '../models';
import { NFTBalancesService } from '../nft/NFTBalancesService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NFT_BALANCES_GET,
  NftBalanceResponse,
  [pageTokens?: NftPageTokens]
>;

@injectable()
export class GetNftBalancesHandler implements HandlerType {
  method = ExtensionRequest.NFT_BALANCES_GET as const;

  constructor(
    private nftBalancesService: NFTBalancesService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const params = request.params;
    let [pageTokens] = params;

    if (!pageTokens) {
      pageTokens = {
        [TokenType.ERC721]: undefined,
        [TokenType.ERC1155]: undefined,
      };
    }
    if (!scope) {
      return {
        ...request,
        error: 'No request scope provided',
      };
    }
    const currentNetwork = await this.networkService.getNetwork(scope);

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
      const result = await this.nftBalancesService.getNftBalances(
        this.accountsService.activeAccount.addressC, // using evm address directly since btc will never support nfts
        currentNetwork,
        pageTokens
      );

      return {
        ...request,
        result,
      };
    } catch (e) {
      console.error(e);
      return {
        ...request,
        error: (e as any).toString(),
      };
    }
  };
}
