import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { accounts$ } from '../accounts';

class AvalancheGetAccountsHandler implements DappRequestHandler {
  handleAuthenticated = async (request) => {
    const accounts = await firstValueFrom(accounts$);

    return {
      ...request,
      result: accounts,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}

export const AvalancheGetAccountsRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.AVALANCHE_GET_ACCOUNTS,
  new AvalancheGetAccountsHandler(),
];
