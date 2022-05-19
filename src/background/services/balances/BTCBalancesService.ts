import { satoshiToBtc } from '@avalabs/bridge-sdk';
import { balanceToDisplayValue, bigToBN } from '@avalabs/utils-sdk';
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
import {
  ActiveNetwork,
  isForNetworkVM,
  NetworkVM,
} from '@src/background/services/network/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { singleton } from 'tsyringe';
import { SettingsService } from '../settings/SettingsService';
import { TokenWithBalance } from './models';

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

  async getBalances(
    userAddress: string,
    network: ActiveNetwork
  ): Promise<TokenWithBalance[]> {
    if (!isForNetworkVM(network, NetworkVM.BITCOIN)) return [];

    const provider = this.networkService.getProviderForNetwork(network);
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const tokenPrice = await this.tokenPricesService.getPriceByCoinId(
      network.nativeToken.coinId,
      selectedCurrency
    );
    const denomination = network.nativeToken.denomination;
    const { balance: balanceSatoshis, utxos } = await provider.getUtxoBalance(
      userAddress
    );
    const balanceBig = satoshiToBtc(balanceSatoshis);
    const balance = bigToBN(balanceBig, denomination);
    // TODO: probably need to normalize the balance,
    // balanceDisplayValue and priceDisplayValue
    return [
      {
        ...network.nativeToken,
        balance,
        balanceDisplayValue: balanceToDisplayValue(balance, denomination),
        balanceUsdDisplayValue: tokenPrice
          ? balanceBig.mul(tokenPrice).toFixed(2)
          : undefined,
        priceUSD: tokenPrice,
        utxos,
        logoURI:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
      },
    ];
  }
}
