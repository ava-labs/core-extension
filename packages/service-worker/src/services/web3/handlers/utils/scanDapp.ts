import Blockaid from '@blockaid/client';
import { resolve } from '@avalabs/core-utils-sdk';

export type DappScanResult = 'malicious' | 'benign' | 'unknown' | 'error';

export const scanDapp = async (dAppURL: string): Promise<DappScanResult> => {
  const baseURL = process.env.PROXY_URL + '/proxy/blockaid/';

  const blockaid = new Blockaid({
    baseURL,
    apiKey: 'key', // Proxy API will append the actual API key, this here is just so the SDK does not complain
  });
  const [response, error] = await resolve(blockaid.site.scan({ url: dAppURL }));

  if (error) {
    return 'error';
  }

  if (response === null || response.status === 'miss') {
    return 'unknown';
  }

  return response.is_malicious ? 'malicious' : 'benign';
};
