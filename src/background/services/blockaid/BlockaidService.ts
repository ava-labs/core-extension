import { singleton } from 'tsyringe';
import type { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import Blockaid from '@blockaid/client';
import { FeatureGates } from '../featureFlags/models';
import type { JsonRpcRequestPayload } from '@src/background/connections/dAppConnection/models';
import type { MessageType } from '../messages/models';

@singleton()
export class BlockaidService {
  #baseUrl: string;
  #blockaid: Blockaid;

  constructor(private featureFlagService: FeatureFlagService) {
    this.#baseUrl = process.env.PROXY_URL + '/proxy/blockaid/';
    this.#blockaid = new Blockaid({
      baseURL: this.#baseUrl,
      apiKey: 'key', // Proxy API will append the actual API key, this here is just so the SDK does not complain
    });
  }

  async jsonRPCScan(
    chainId: string,
    from: string,
    request: JsonRpcRequestPayload<MessageType, any[]>,
  ) {
    if (
      !this.featureFlagService.featureFlags[FeatureGates.BLOCKAID_JSONRPC_SCAN]
    ) {
      return null;
    }
    try {
      const result = await this.#blockaid.evm.jsonRpc.scan({
        chain: chainId,
        options: ['validation', 'simulation'],
        account_address: from,
        data: { method: request.method, params: request.params },
        metadata: { domain: request.site?.domain || '' },
      });
      return result;
    } catch (e) {
      console.error('Error: ', e);
      return null;
    }
  }
}
