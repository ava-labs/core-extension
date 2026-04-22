import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';
import { ethErrors } from 'eth-rpc-errors';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_BRIDGE_DEV_ENV,
  true,
  [isBridgeDevEnv: boolean]
>;

@injectable()
export class SetBridgeDevEnvHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_BRIDGE_DEV_ENV as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [isBridgeDevEnv] = request.params || [];
    if (typeof isBridgeDevEnv !== 'boolean') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams('Invalid param, must be a boolean'),
      };
    }

    await this.settingsService.setBridgeDevEnv(isBridgeDevEnv);
    return {
      ...request,
      result: true,
    };
  };
}
