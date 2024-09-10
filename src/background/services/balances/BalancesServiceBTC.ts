import { BitcoinModule } from '@avalabs/bitcoin-module';
import { isString, mapValues } from 'lodash';
import { singleton } from 'tsyringe';
import { Account } from '../accounts/models';
import { SettingsService } from '../settings/SettingsService';
import * as Sentry from '@sentry/browser';
import { TokensPriceShortData } from '../tokens/models';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { getPriceChangeValues } from './utils/getPriceChangeValues';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { NetworkWithCaipId } from '../network/models';
import { TokenWithBalanceBTC } from '@avalabs/vm-module-types';

@singleton()
export class BalancesServiceBTC {
  constructor(
    private settingsService: SettingsService,
    private moduleManager: ModuleManager
  ) {}

  getServiceForProvider(provider: any) {
    if (provider instanceof BitcoinProvider) return this;
  }

  async getBalances(
    accounts: Account[],
    network: NetworkWithCaipId,
    priceChanges?: TokensPriceShortData
  ): Promise<Record<string, Record<string, TokenWithBalanceBTC>>> {
    const sentryTracker = Sentry.startTransaction({
      name: 'BalancesServiceBTC: getBalances',
    });
    const currency = (
      await this.settingsService.getSettings()
    ).currency.toLowerCase();

    const module = (await this.moduleManager.loadModuleByNetwork(
      network
    )) as BitcoinModule;
    const addresses = accounts
      .map(({ addressBTC }) => addressBTC)
      .filter(isString);

    const rawBalances = await module.getBalances({
      addresses,
      currency,
      network,
    });

    // Apply price changes data, VM Modules don't do this yet
    const balances = mapValues(rawBalances, (accountBalance) => {
      return mapValues(accountBalance, (tokenBalance) => ({
        ...tokenBalance,
        priceChanges: getPriceChangeValues(
          tokenBalance.symbol,
          tokenBalance.balanceInCurrency,
          priceChanges
        ),
      }));
    });

    sentryTracker.finish();
    return balances;
  }
}
