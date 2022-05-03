import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkFeeService } from '../NetworkFeeService';

@injectable()
export class GetNetworkFeeHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.NETWORK_FEE_GET];

  constructor(private networkFeeService: NetworkFeeService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    return {
      ...request,
      result: await this.networkFeeService.getNetworkFee(),
    };
  };
}
