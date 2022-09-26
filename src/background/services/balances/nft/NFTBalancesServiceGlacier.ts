import { Network } from '@avalabs/chains-sdk';
import { CurrencyCode } from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';
import { GlacierService } from '../../glacier/GlacierService';
import { SettingsService } from '../../settings/SettingsService';
import { BalancesServiceGlacier } from '../BalancesServiceGlacier';
import { NFTService } from './models';

@singleton()
export class NFTBalancesServiceGlacier implements NFTService {
  constructor(
    private balancesServiceGlacier: BalancesServiceGlacier,
    private glacierService: GlacierService,
    private settingsService: SettingsService
  ) {}

  isAggregatorForChain(chainId: number) {
    return this.glacierService.isNetworkSupported(chainId);
  }

  async getNFTBalances(address: string, network: Network) {
    const selectedCurrency = (
      await this.settingsService.getSettings()
    ).currency.toLowerCase() as CurrencyCode;

    return this.balancesServiceGlacier.getNFTBalanceForNetwork(
      network,
      address,
      selectedCurrency
    );
  }
}
