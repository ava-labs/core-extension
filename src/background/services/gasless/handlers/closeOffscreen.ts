import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_CLOSE_OFFSCREEN,
  true
>;

@injectable()
export class CloseGaslessOffscreenHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_CLOSE_OFFSCREEN as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    try {
      await this.gasStationService.closeOffscreen();
      return {
        ...request,
        result: true,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
