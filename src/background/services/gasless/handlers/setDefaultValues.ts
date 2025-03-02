import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_SET_DEFAUlT_VALUES,
  typeof DEFERRED_RESPONSE
>;

@injectable()
export class SetGaslessDefaultValuesHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_SET_DEFAUlT_VALUES as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    console.log('SetGaslessDefaultValuesHandler: ');
    this.gasStationService.setDefaultValues();
    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };
}
