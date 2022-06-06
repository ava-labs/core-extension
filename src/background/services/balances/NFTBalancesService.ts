import { injectAll, singleton } from 'tsyringe';
import { Network } from '@avalabs/chains-sdk';
import { NFTAggregatorService } from './nftBalanceAggregators/models';
import './nftBalanceAggregators/registry';

@singleton()
export class NFTBalancesService {
  constructor(
    @injectAll('NFTAggregatorService')
    private aggregators: NFTAggregatorService[]
  ) {}

  async getNftBalances(address: string, network: Network) {
    const provider = this.getNftProviderForNetwork(network);
    if (!provider) {
      throw new Error('NFTs not supported on the network');
    }
    return provider.getNFTBalances(address, network);
  }

  private getNftProviderForNetwork(
    network: Network
  ): NFTAggregatorService | undefined {
    return this.aggregators.find((aggregator) =>
      aggregator.isAggregatorForChain(network.chainId)
    );
  }
}
