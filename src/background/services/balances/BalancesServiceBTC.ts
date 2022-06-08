import { satoshiToBtc } from '@avalabs/bridge-sdk';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { balanceToDisplayValue, bigToBN } from '@avalabs/utils-sdk';
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { singleton } from 'tsyringe';
import { Account } from '../accounts/models';
import { SettingsService } from '../settings/SettingsService';
import { TokenType, TokenWithBalance } from './models';

@singleton()
export class BalancesServiceBTC {
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
    account: Account,
    network: Network
  ): Promise<{ address: string; balances: TokenWithBalance[] }> {
    if (network.vmName !== NetworkVMType.BITCOIN) {
      return {
        address: account.addressBTC,
        balances: [],
      };
    }

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
      account.addressBTC
    );
    const balanceBig = satoshiToBtc(balanceSatoshis);
    const balance = bigToBN(balanceBig, denomination);
    const balanceUSD = tokenPrice ? balanceBig.times(tokenPrice).toNumber() : 0;

    return {
      address: account.addressBTC,
      balances: [
        {
          ...network.networkToken,
          type: TokenType.NATIVE,
          balance,
          balanceDisplayValue: balanceToDisplayValue(balance, denomination),
          balanceUSD,
          balanceUsdDisplayValue: tokenPrice
            ? balanceBig.mul(tokenPrice).toFixed(2)
            : undefined,
          priceUSD: tokenPrice,
          utxos,
          logoUri:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
        },
      ],
    };
  }
}
