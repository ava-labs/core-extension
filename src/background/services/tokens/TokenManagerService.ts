import { Network, NetworkContractToken } from '@avalabs/chains-sdk';
import { singleton } from 'tsyringe';
import { SettingsService } from '../settings/SettingsService';

@singleton()
export class TokenManagerService {
  constructor(private settingsService: SettingsService) {}

  async getTokensForNetwork(network: Network): Promise<NetworkContractToken[]> {
    const settings = await this.settingsService.getSettings();
    return Object.values(settings.customTokens[network.chainId] || {}) || [];
  }
}
