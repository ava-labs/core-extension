import {
  DAppRequestHandler,
  DAppProviderRequest,
  JsonRpcRequestParams,
  Languages,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type Params = [language?: string];

// Avalanche add account handler
// This handler is similar to the AddAccountHandler, but it is used for dapp adding accounts to primary accounts
@injectable()
export class AvalancheSetLanguageHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.AVALANCHE_SET_LANGUAGE];

  constructor(private settingsService: SettingsService) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request } = rpcCall;

    try {
      const [language] = request.params || [];

      if (!language) {
        throw new Error('Empty language parameter');
      }
      const availableLanguages = Object.values(Languages);
      if (!availableLanguages.includes(language as Languages)) {
        throw new Error('Invalid language parameter');
      }

      await this.settingsService.setLanguage(language as Languages);
      return {
        ...request,
        result: language,
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
