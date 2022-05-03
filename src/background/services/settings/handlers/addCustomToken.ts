import { resolve } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class AddCustomTokenHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_ADD_CUSTOM_TOKEN];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [tokenAddress] = request.params || [];

    const [, err] = await resolve(
      this.settingsService.addCustomToken(tokenAddress)
    );

    if (err) {
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
