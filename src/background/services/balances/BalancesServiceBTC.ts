import { satoshiToBtc } from '@avalabs/bridge-sdk';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { balanceToDisplayValue, bigToBN } from '@avalabs/utils-sdk';
import { TokenPricesService } from '@src/background/services/balances/TokenPricesService';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { singleton } from 'tsyringe';
import { Account } from '../accounts/models';
import { SettingsService } from '../settings/SettingsService';
import { TokenType, TokenWithBalance } from './models';
import * as Sentry from '@sentry/browser';

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
    accounts: Account[],
    network: Network
  ): Promise<Record<string, Record<string, TokenWithBalance>>> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalancesServiceBTC: getBalances',
    });
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

    const balances = (
      await Promise.allSettled(
        accounts.map(async (account) => {
          if (network.vmName !== NetworkVMType.BITCOIN) {
            return {
              address: account.addressBTC,
              balances: [],
            };
          }

          const denomination = network.networkToken.decimals;
          const {
            balance: balanceSatoshis,
            utxos,
            balanceUnconfirmed: balanceSatoshisUnconfirmed,
          } = await provider.getUtxoBalance(account.addressBTC);

          const balanceBig = satoshiToBtc(balanceSatoshis);
          const balance = bigToBN(balanceBig, denomination);
          const balanceUSD = tokenPrice
            ? balanceBig.times(tokenPrice).toNumber()
            : 0;
          const unconfirmedBalanceBig = satoshiToBtc(
            balanceSatoshisUnconfirmed
          );
          const unconfirmedBalance = bigToBN(
            unconfirmedBalanceBig,
            denomination
          );
          const unconfirmedBalanceUSD = tokenPrice
            ? unconfirmedBalanceBig.times(tokenPrice).toNumber()
            : 0;
          return {
            address: account.addressBTC,
            balances: {
              [network.networkToken.symbol]: {
                ...network.networkToken,
                type: TokenType.NATIVE,
                balance,
                balanceDisplayValue: balanceToDisplayValue(
                  balance,
                  denomination
                ),
                balanceUSD,
                balanceUsdDisplayValue: tokenPrice
                  ? balanceBig.mul(tokenPrice).toFixed(2)
                  : undefined,
                priceUSD: tokenPrice,
                utxos,
                unconfirmedBalance,
                unconfirmedBalanceDisplayValue: balanceToDisplayValue(
                  unconfirmedBalance,
                  denomination
                ),
                unconfirmedBalanceUsdDisplayValue: tokenPrice
                  ? unconfirmedBalanceBig.mul(tokenPrice).toFixed(2)
                  : undefined,
                unconfirmedBalanceUSD,
                logoUri:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
              },
            },
          };
        })
      )
    ).reduce((acc, result) => {
      if (result.status === 'rejected') {
        return acc;
      }

      return {
        ...acc,
        [result.value.address]: result.value.balances,
      };
    }, {});
    sentryTracker.finish();
    return balances;
  }
}
