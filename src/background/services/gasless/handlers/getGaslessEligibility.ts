import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_GET_ELIGIBILITY,
  boolean,
  [chainId: number | string]
>;

@injectable()
export class GetGaslessEligibilityHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_GET_ELIGIBILITY as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [chainId] = request.params;

    const result = await this.gasStationService.getEligibility(`${chainId}`);
    return {
      ...request,
      result,
    };
  };
}
