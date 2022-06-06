import { resolve } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { TokenManagerService } from '../../tokens/TokenManagerService';
import { SettingsService } from '../SettingsService';

@injectable()
export class AddCustomTokenHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN];

  constructor(
    private settingsService: SettingsService,
    private tokenManagerService: TokenManagerService
  ) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [tokenAddress] = request.params || [];
    const [tokenData, err] = await resolve(
      this.tokenManagerService.getTokenData(tokenAddress)
    );

    if (!tokenData || err) {
      return {
        ...request,
        error: `ERC20 contract ${tokenAddress} does not exist.`,
      };
    }

    const [, saveError] = await resolve(
      this.settingsService.addCustomToken(tokenData)
    );

    if (saveError) {
      return {
        ...request,
        result: false,
        error: (err as any).toString(),
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
