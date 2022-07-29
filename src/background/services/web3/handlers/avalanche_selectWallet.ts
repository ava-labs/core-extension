import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { injectable } from 'tsyringe';

@injectable()
export class AvalancheSelectWalletHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SELECT_WALLET];

  handleUnauthenticated = async (request) => {
    const [availableExtensions] = request.params;

    if (!availableExtensions || availableExtensions.length === 0) {
      return {
        ...request,
        error: 'no wallet options available',
      };
    }

    const options = availableExtensions.map((ext) => ['options', ext.type]);
    const queryParams = new URLSearchParams([
      ...options,
      ['id', request.id],
      ['domain', request.site.domain],
      ['tabId', request.site.tabId],
    ]);

    await openExtensionNewWindow(
      `selectWallet`,
      queryParams.toString(),
      request.meta?.coords
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };
}
