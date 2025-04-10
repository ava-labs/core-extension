import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { GasStationService } from '../GasStationService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GASLESS_GET_ELIGIBILITY,
  boolean,
  [
    chainId: number | string,
    fromAddress: string | undefined,
    nonce: number | undefined,
  ]
>;

@injectable()
export class GetGaslessEligibilityHandler implements HandlerType {
  method = ExtensionRequest.GASLESS_GET_ELIGIBILITY as const;

  constructor(private gasStationService: GasStationService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [chainId, fromAddress, nonce] = request.params;

    const result = await this.gasStationService.getEligibility({
      chainId: `${chainId}`,
      fromAddress,
      nonce,
    });
    return {
      ...request,
      result,
    };
  };
}
