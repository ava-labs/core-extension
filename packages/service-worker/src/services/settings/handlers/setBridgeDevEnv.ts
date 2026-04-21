import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_BRIDGE_DEV_ENV,
  true,
  [filter: boolean]
>;

@injectable()
export class SetBridgeDevEnvHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_BRIDGE_DEV_ENV as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [filter] = request.params || [];
    await this.settingsService.setBridgeDevEnv(filter);
    return {
      ...request,
      result: true,
    };
  };
}
