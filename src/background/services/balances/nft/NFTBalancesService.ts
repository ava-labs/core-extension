import { injectAll, singleton } from 'tsyringe';
import { ChainId, Network } from '@avalabs/chains-sdk';
import { NFTService } from './models';
import './registry';
import { NFTBalancesServiceCovalent } from './NFTBalancesServiceCovalent';

@singleton()
export class NFTBalancesService {
  constructor(
    @injectAll('NFTService')
    private services: NFTService[],
    private covalentService: NFTBalancesServiceCovalent
  ) {}

  async getNftBalances(address: string, network: Network) {
    const networksWithNFTSupport = [
      ChainId.AVALANCHE_MAINNET_ID,
      ChainId.AVALANCHE_TESTNET_ID,
      ChainId.ETHEREUM_HOMESTEAD,
    ];
    const provider = await this.getNftProviderForNetwork(network);
    if (!provider || !networksWithNFTSupport.includes(network.chainId)) {
      throw new Error('NFTs not supported on the network');
    }
    return provider.getNFTBalances(address, network);
  }

  private async getNftProviderForNetwork(
    network: Network
  ): Promise<NFTService | undefined> {
    const services = await Promise.all(
      this.services.map(async (aggregator) => {
        const isAggergator = await aggregator.isAggregatorForChain(
          network.chainId
        );
        return isAggergator ? aggregator : undefined;
      })
    );
    /**
     * Adding covalent service here in case Glacier is
     * down, this will/should be the fallback in this case
     *
     */
    return [...services, this.covalentService].find((serv) => !!serv);
  }
}
