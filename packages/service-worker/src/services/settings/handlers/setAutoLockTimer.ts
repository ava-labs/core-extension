import {
  AutoLockTimer,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_AUTO_LOCK_TIMER,
  true,
  [autoLockTimer: AutoLockTimer]
>;

@injectable()
export class SetAutoLockTimerHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_AUTO_LOCK_TIMER as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [autoLockTimer] = request.params;
    await this.settingsService.setAutoLockTimer(autoLockTimer);

    return {
      ...request,
      result: true,
    };
  };
}
