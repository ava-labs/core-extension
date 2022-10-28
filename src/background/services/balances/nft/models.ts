import { Network } from '@avalabs/chains-sdk';
import { NftBalanceResponse } from '../models';

export interface NFTService {
  isAggregatorForChain(chainId: number): Promise<boolean>;
  getNFTBalances(
    address: string,
    network: Network,
    pageToken: string | undefined
  ): Promise<NftBalanceResponse>;
}
