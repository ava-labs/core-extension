import { DAppRequestHandler, DAppProviderRequest } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

// Avalanche add account handler
// This handler is similar to the AddAccountHandler, but it is used for dapp adding accounts to primary accounts
@injectable()
export class AvalancheGetSettingsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_SETTINGS];

  constructor(private settingsService: SettingsService) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    try {
      const settings = await this.settingsService.getSettings();
      console.log('settings: ', settings);
      return {
        ...request,
        result: settings,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
