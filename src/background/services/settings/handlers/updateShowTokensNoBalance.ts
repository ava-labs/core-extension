import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_UPDATE_SHOW_NO_BALANCE,
  true,
  [showTokensWithoutBalances: boolean]
>;

@injectable()
export class UpdateShowNoBalanceHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_UPDATE_SHOW_NO_BALANCE as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
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
