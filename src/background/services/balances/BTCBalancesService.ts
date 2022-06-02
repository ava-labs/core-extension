import { satoshiToBtc } from '@avalabs/bridge-sdk';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { balanceToDisplayValue, bigToBN } from '@avalabs/utils-sdk';
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
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
    network: Network
  ): Promise<TokenWithBalance[]> {
    if (network.vmName !== NetworkVMType.BITCOIN) return [];

    const provider = await this.networkService.getBitcoinProvider();
    const selectedCurrency = (await this.settingsService.getSettings())
      .currency;
    const coingeckoTokenId = network.pricingProviders?.coingecko.nativeTokenId;
    const tokenPrice = coingeckoTokenId
      ? await this.tokenPricesService.getPriceByCoinId(
          coingeckoTokenId,
          selectedCurrency
        )
      : undefined;
    const denomination = network.networkToken.decimals;
    const { balance: balanceSatoshis, utxos } = await provider.getUtxoBalance(
      userAddress
    );
    const balanceBig = satoshiToBtc(balanceSatoshis);
    const balance = bigToBN(balanceBig, denomination);
    // TODO: probably need to normalize the balance,
    // balanceDisplayValue and priceDisplayValue
    return [
      {
        ...network.networkToken,
        isERC20: false,
        isNetworkToken: true,
        balance,
        balanceDisplayValue: balanceToDisplayValue(balance, denomination),
        balanceUsdDisplayValue: tokenPrice
          ? balanceBig.mul(tokenPrice).toFixed(2)
          : undefined,
        priceUSD: tokenPrice,
        utxos,
        logoUri:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
      },
    ];
  }
}
