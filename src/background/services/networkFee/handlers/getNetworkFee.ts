import { Network } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { NetworkFeeService } from '../NetworkFeeService';

@injectable()
export class GetNetworkFeeHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NETWORK_FEE_GET];

  constructor(
    private networkFeeService: NetworkFeeService,
    private networkService: NetworkService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [chainId] = (request.params || []) as [number | undefined];

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
