import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { contacts$ } from '../contacts';
class AvalancheGetContactsHandler implements DappRequestHandler {
  handleAuthenticated = async (request) => {
    const contacts = await firstValueFrom(contacts$);

    return {
      ...request,
      result: contacts.contacts,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}

export const AvalancheGetContactsRequest: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.AVALANCHE_GET_CONTACTS,
  new AvalancheGetContactsHandler(),
];
