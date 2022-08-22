import { SettingsService } from './../SettingsService';
import { resolve } from '@avalabs/utils-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
import xss from 'xss';
import { isTokenSupported } from '../../tokens/utils/isTokenSupported';
import { NetworkService } from '../../network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { Action } from '../../actions/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';

@injectable()
export class WalletWatchAssetHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_WATCH_ASSET];
  constructor(
    private tokenManagerService: TokenManagerService,
    private settingsService: SettingsService,
    private networkService: NetworkService
  ) {
    super();
  }

  handleUnauthenticated = async (request) => {
    const tokenAddress = request.params.options.address;
    const imageUrl = xss(request.params.options.image);

    const network = await this.networkService.activeNetwork.promisify();
    if (!network) {
      return {
        ...request,
        error: ethErrors.rpc.internal({
          message: 'Unable to detect current network selection.',
        }),
      };
    }

    const settings = await this.settingsService.getSettings();

    try {
      const tokenAlreadyExists = await isTokenSupported(
        tokenAddress,
        network,
        settings
      );
      if (tokenAlreadyExists) {
        return { ...request, result: true };
      }
    } catch (err: any) {
      return {
        ...request,
        error: ethErrors.rpc.internal({
          message: err?.message
            ? err.message
            : 'Unable to check if the token already exists',
        }),
      };
    }

    const [tokenData, err] = await resolve(
      this.tokenManagerService.getTokenData(tokenAddress)
    );

    if (!tokenData || err) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: `ERC20 contract ${tokenAddress} does not exist.`,
        }),
      };
    }

    const actionData = {
      ...request,
      displayData: { ...tokenData, logoUri: imageUrl },
      tabId: request.site.tabId,
    };

    await this.openApprovalWindow(
      actionData,
      `approve/watch-asset?id=${request.id}`
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    try {
      await this.settingsService.addCustomToken(pendingAction.displayData);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
