import {
  ExtensionRequest,
  ExtensionRequestHandler,
  NetworkFee,
  NetworkWithCaipId,
} from '@core/types';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { NetworkFeeService } from '../NetworkFeeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_FEE_GET,
  NetworkFee | null,
  [networkId?: string | number]
>;

@injectable()
export class GetNetworkFeeHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_FEE_GET as const;

  constructor(
    private networkFeeService: NetworkFeeService,
    private networkService: NetworkService,
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const [networkId] = request.params;

    let network: NetworkWithCaipId | undefined;

    if (networkId) {
      network = await this.networkService.getNetwork(networkId);
    } else {
      network = await this.networkService.getNetwork(scope);
    }

    if (!network) {
      return { ...request, error: 'invalid or missing network id' };
    }

    return {
      ...request,
      result: await this.networkFeeService.getNetworkFee(network),
    };
  };
}
