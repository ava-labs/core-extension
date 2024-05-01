import { JsonRpcEngine } from 'json-rpc-engine';
import { createFetchMiddleware } from 'eth-json-rpc-middleware';
import { Network } from '@avalabs/chains-sdk';
import { addGlacierAPIKeyIfNeeded } from './network/addGlacierAPIKeyIfNeeded';

export async function engine(network: Network) {
  const fetchMiddleware = createFetchMiddleware({
    get rpcUrl() {
      return addGlacierAPIKeyIfNeeded(network.rpcUrl);
    },
  });
  const rpcEngine = new JsonRpcEngine();
  rpcEngine.push(fetchMiddleware);
  return rpcEngine;
}
