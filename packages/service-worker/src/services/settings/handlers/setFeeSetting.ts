import {
  ExtensionRequest,
  ExtensionRequestHandler,
  FeeSetting,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_FEE_SETTING,
  true,
  [feeSetting: FeeSetting]
>;

@injectable()
export class SetFeeSettingHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_FEE_SETTING as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [feeSetting] = request.params || ['medium'];
    await this.settingsService.setFeeSetting(feeSetting);

    return {
      ...request,
      result: true,
    };
  };
}
