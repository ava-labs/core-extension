import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

@injectable()
export class UpdateShowNoBalanceHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SETTINGS_UPDATE_SHOW_NO_BALANCE];

  constructor(private settingsService: SettingsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [showTokensWithoutBalances] = request.params || [];

    await this.settingsService.setShowTokensWithNoBalance(
      !!showTokensWithoutBalances
    );

    return {
      ...request,
      result: true,
    };
  };
}
