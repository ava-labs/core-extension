import { Glacier } from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';

import { HEADERS } from './glacierConfig';
import { getAuthHeaders } from '../appcheck/utils/getAuthHeaders';

@singleton()
export class GlacierService {
  constructor() {}

  async #getClient() {
    return new Glacier({
      BASE: process.env.CORE_PROXY_GLACIER_BASE_URL,
      HEADERS: {
        ...HEADERS,
        ...(await getAuthHeaders()),
      },
    });
  }

  async getEvmChainsForAddress(address: string) {
    const client = await this.#getClient();
    return client.evmChains.listAddressChains({
      address,
    });
  }
}
