import { Network } from '@avalabs/core-chains-sdk';
import { NftBalanceResponse, NftPageTokens } from '../models';

export interface NFTService {
  isAggregatorForChain(chainId: number): Promise<boolean>;
  getNFTBalances(
    address: string,
    network: Network,
    pageTokens: NftPageTokens
  ): Promise<NftBalanceResponse>;
}
