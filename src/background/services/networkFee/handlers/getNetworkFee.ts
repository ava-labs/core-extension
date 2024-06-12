import { Network } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { NetworkFee } from '../models';
import { NetworkFeeService } from '../NetworkFeeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_FEE_GET,
  NetworkFee | null,
  [chainId: number] | undefined
>;

@injectable()
export class GetNetworkFeeHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_FEE_GET as const;

  constructor(
    private networkFeeService: NetworkFeeService,
    private networkService: NetworkService
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [chainId] = request.params || [];

    let network: Network | undefined;

    if (typeof chainId === 'number') {
      network = await this.networkService.getNetwork(chainId);
      if (!network) return { ...request, error: 'invalid chainId' };
    }

    return {
      ...request,
      result: await this.networkFeeService.getNetworkFee(network),
    };
  };
}
