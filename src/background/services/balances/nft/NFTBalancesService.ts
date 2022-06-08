import { injectAll, singleton } from 'tsyringe';
import { Network } from '@avalabs/chains-sdk';
import { NFTService } from './models';
import './registry';

@singleton()
export class NFTBalancesService {
  constructor(
    @injectAll('NFTService')
    private services: NFTService[]
  ) {}

  async getNftBalances(address: string, network: Network) {
    const provider = this.getNftProviderForNetwork(network);
    if (!provider) {
      throw new Error('NFTs not supported on the network');
    }
    return provider.getNFTBalances(address, network);
  }

  private getNftProviderForNetwork(network: Network): NFTService | undefined {
    return this.services.find((aggregator) =>
      aggregator.isAggregatorForChain(network.chainId)
    );
  }
}
