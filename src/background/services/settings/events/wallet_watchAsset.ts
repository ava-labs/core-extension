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
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { AddCustomTokenData } from '../models';

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

  handleUnauthenticated = async ({ request, scope }) => {
    const tokenAddress = request.params.options.address;
    const imageUrl = xss(request.params.options.image);

    const network = await this.networkService.getNetwork(scope);

    if (!network) {
      return {
        ...request,
        error: ethErrors.rpc.internal({
          message: 'Target network not found',
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
      this.tokenManagerService.getTokenData(tokenAddress, network)
    );

    if (!tokenData || err) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: `ERC20 contract ${tokenAddress} does not exist.`,
        }),
      };
    }

    const actionData: Action<AddCustomTokenData> = {
      ...request,
      displayData: {
        token: {
          ...tokenData,
          logoUri: imageUrl,
        },
      },
    };

    await openApprovalWindow(actionData, `approve/watch-asset`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleAuthenticated = async (rpcCall) => {
    return this.handleUnauthenticated(rpcCall);
  };

  onActionApproved = async (
    pendingAction: Action<AddCustomTokenData>,
    result,
    onSuccess,
    onError
  ) => {
    try {
      await this.settingsService.addCustomToken(
        pendingAction.displayData.token
      );

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
