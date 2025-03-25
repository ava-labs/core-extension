import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_SET_DEFAUlT_STATE_VALUES,
  undefined
>;

@injectable()
export class SetDefaultStateValuesHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_SET_DEFAUlT_STATE_VALUES as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    this.gasStationService.setDefaultStateValues();
    return {
      ...request,
      result: undefined,
    };
  };
}
