import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { SettingsService } from '../SettingsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.SETTINGS_SET_FILTER_SMALL_UTXOS,
  true,
  [filter: boolean]
>;

@injectable()
export class SetFilterSmallUtxosHandler implements HandlerType {
  method = ExtensionRequest.SETTINGS_SET_FILTER_SMALL_UTXOS as const;

  constructor(private settingsService: SettingsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [filter] = request.params || [];
    await this.settingsService.setFilterSmallUtxos(filter);
    return {
      ...request,
      result: true,
    };
  };
}
