import { SettingsService } from './../SettingsService';
import { resolve } from '@avalabs/utils-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { injectable } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { TokenManagerService } from '../../tokens/TokenManagerService';
import xss from 'xss';
import { isTokenSupported } from '../../tokens/utils/isTokenSupported';
import { NetworkService } from '../../network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';

@injectable()
export class WalletWatchAssetHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_WATCH_ASSET];
  constructor(
    private tokenManagerService: TokenManagerService,
    private actionsService: ActionsService,
    private settingService: SettingsService,
    private networkService: NetworkService
  ) {}

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

    const settings = await this.settingService.getSettings();

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
    await this.actionsService.addAction(actionData);

    await openExtensionNewWindow(
      `approve/watch-asset?id=${request.id}`,
      '',
      request.meta?.coords
    );

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (request) => {
    return this.handleUnauthenticated(request);
  };
}
