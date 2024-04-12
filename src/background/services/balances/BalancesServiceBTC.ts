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
import { TokensPriceShortData } from '../tokens/models';
import { BitcoinProvider } from '@avalabs/wallets-sdk';
import { getPriceChangeValues } from './utils/getPriceChangeValues';

@singleton()
export class BalancesServiceBTC {
  constructor(
    private networkService: NetworkService,
    private tokenPricesService: TokenPricesService,
    private settingsService: SettingsService
  ) {}

  getServiceForProvider(provider: any) {
    if (provider instanceof BitcoinProvider) return this;
  }

  async getBalances(
    accounts: Account[],
    network: Network,
    priceChanges?: TokensPriceShortData
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
          // WalletConnect accounts may be imported without the BTC address.
          // Any accounts like that are filtered out below.
          if (!account.addressBTC) {
            throw new Error('This account does not support BTC');
          }

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
          } = await provider.getUtxoBalance(account.addressBTC, false);

          const balanceBig = satoshiToBtc(balanceSatoshis);
          const balance = bigToBN(balanceBig, denomination);
          const balanceUSD =
            tokenPrice === undefined
              ? undefined
              : balanceBig.times(tokenPrice).toNumber();

          const unconfirmedBalanceBig = satoshiToBtc(
            balanceSatoshisUnconfirmed
          );
          const unconfirmedBalance = bigToBN(
            unconfirmedBalanceBig,
            denomination
          );
          const unconfirmedBalanceUSD =
            tokenPrice === undefined
              ? undefined
              : unconfirmedBalanceBig.times(tokenPrice).toNumber();

          const symbol = network.networkToken.symbol;

          return {
            address: account.addressBTC,
            balances: {
              [symbol]: {
                ...network.networkToken,
                type: TokenType.NATIVE,
                balance,
                balanceDisplayValue: balanceToDisplayValue(
                  balance,
                  denomination
                ),
                balanceUSD,
                balanceUsdDisplayValue:
                  tokenPrice === undefined
                    ? undefined
                    : balanceBig.mul(tokenPrice).toFixed(2),
                priceUSD: tokenPrice,
                utxos,
                unconfirmedBalance,
                unconfirmedBalanceDisplayValue: balanceToDisplayValue(
                  unconfirmedBalance,
                  denomination
                ),
                unconfirmedBalanceUsdDisplayValue:
                  tokenPrice === undefined
                    ? undefined
                    : unconfirmedBalanceBig.mul(tokenPrice).toFixed(2),
                unconfirmedBalanceUSD,
                logoUri:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
                priceChanges: getPriceChangeValues(
                  symbol,
                  balanceUSD,
                  priceChanges
                ),
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
