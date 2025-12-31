import {
  ExtensionRequest,
  ExtensionRequestHandler,
  MaxBuyOption,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_MAX_BUY,
  true,
  [maxBuy: MaxBuyOption]
>;

@injectable()
export class SetMaxBuyHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_MAX_BUY as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [maxBuy] = request.params || ['unlimited'];
    await this.settingsService.setMaxBuy(maxBuy);

    return {
      ...request,
      result: true,
    };
  };
}
