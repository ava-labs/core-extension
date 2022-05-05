import { BlockCypherProvider } from '@avalabs/wallets-sdk';
import { singleton } from 'tsyringe';
import { BITCOIN_NETWORK } from '@src/background/services/network/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { CoinGeckoService } from '@src/background/services/balances/CoinGeckoService';

@singleton()
export class BTCBalancesService {
  constructor(
    private networkService: NetworkService,
    private coingeckoService: CoinGeckoService
  ) {}

  getServiceForProvider(provider: any) {
    // TODO: this should get move to the wallets sdk and every btc provider tried in here
    if (!!provider && !!provider.blockCypher) return this;
  }

  async getBalances(userAddress: string, network: typeof BITCOIN_NETWORK) {
    const provider = this.networkService.getProviderForNetwork(
      network
    ) as BlockCypherProvider;
    const tokenPrice = await this.coingeckoService.getTokenPrice(
      network.nativeToken.coinId
    );
    const balance = await provider.getBalance(userAddress);
    // TODO: probably need to normalize the balance,
    // balanceDisplayValue and priceDisplayValue
    return [
      {
        ...network.nativeToken,
        balance,
        balanceUsdDisplayValue: (tokenPrice.price * balance).toFixed(2),
      },
    ];
  }
}
