import { BlockCypherProvider } from '@avalabs/wallets-sdk';
import { singleton } from 'tsyringe';
import { BITCOIN_NETWORK } from '@src/background/services/network/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
import { SettingsService } from '../settings/SettingsService';

@singleton()
export class BTCBalancesService {
  constructor(
    private networkService: NetworkService,
    private tokenPricesService: TokenPricesService,
    private settingsService: SettingsService
  ) {}

  getServiceForProvider(provider: any) {
    // TODO: this should get move to the wallets sdk and every btc provider tried in here
    if (!!provider && !!provider.blockCypher) return this;
  }

  async getBalances(userAddress: string, network: typeof BITCOIN_NETWORK) {
    const provider = this.networkService.getProviderForNetwork(
      network
    ) as BlockCypherProvider;
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const tokenPrice = await this.tokenPricesService.getPriceByCoinId(
      network.nativeToken.coinId,
      selectedCurrency
    );
    const balance = await provider.getBalances(userAddress);
    // TODO: probably need to normalize the balance,
    // balanceDisplayValue and priceDisplayValue
    return [
      {
        ...network.nativeToken,
        balance,
        balanceUsdDisplayValue: (tokenPrice.price * balance.final).toFixed(2),
      },
    ];
  }
}
