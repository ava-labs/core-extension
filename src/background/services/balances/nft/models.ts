import { Network } from '@avalabs/chains-sdk';
import { NftTokenWithBalance } from '../models';

export interface NFTService {
  isAggregatorForChain(chainId: number): Promise<boolean>;
  getNFTBalances(
    address: string,
    network: Network
  ): Promise<NftTokenWithBalance[]>;
}
