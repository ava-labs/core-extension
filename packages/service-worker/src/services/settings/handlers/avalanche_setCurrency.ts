import {
  DAppRequestHandler,
  DAppProviderRequest,
  JsonRpcRequestParams,
  CURRENCIES,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type Params = [currency?: string];

// Avalanche add account handler
// This handler is similar to the AddAccountHandler, but it is used for dapp adding accounts to primary accounts
@injectable()
export class AvalancheSetCurrencyHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.AVALANCHE_SET_CURRENCY];

  constructor(private settingsService: SettingsService) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request } = rpcCall;

    try {
      const [currency] = request.params || [];

      if (!currency) {
        throw new Error('Empty currency parameter');
      }
      const availableLanguages = Object.values(CURRENCIES);
      if (!availableLanguages.includes(currency as CURRENCIES)) {
        throw new Error('Invalid currency parameter');
      }

      await this.settingsService.setCurrencty(currency as CURRENCIES);
      return {
        ...request,
        result: currency,
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
