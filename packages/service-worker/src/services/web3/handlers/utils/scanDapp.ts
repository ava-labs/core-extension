import Blockaid from '@blockaid/client';
import { resolve } from '@avalabs/core-utils-sdk';

export const scanDapp = async (dAppURL: string) => {
  const baseURL = process.env.PROXY_URL + '/proxy/blockaid/';

  const blockaid = new Blockaid({
    baseURL,
    apiKey: 'key', // Proxy API will append the actual API key, this here is just so the SDK does not complain
  });
  const [response, error] = await resolve(blockaid.site.scan({ url: dAppURL }));

  if (response === null || error || response.status === 'miss') {
    return 'unknown';
  }

  return response.is_malicious ? 'malicious' : 'benign';
};
