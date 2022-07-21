import { JsonRpcEngine } from 'json-rpc-engine';
import { createFetchMiddleware } from 'eth-json-rpc-middleware';
import { Network } from '@avalabs/chains-sdk';
import { addGlacierAPIKeyIfNeeded } from './addGlacierAPIKeyIfNeeded';

export { JsonRpcRequest } from 'json-rpc-engine';

export async function engine(network: Network) {
  const fetchMiddleware = createFetchMiddleware({
    get rpcUrl() {
      return addGlacierAPIKeyIfNeeded(network.rpcUrl);
    },
  });
  const engine = new JsonRpcEngine();
  engine.push(fetchMiddleware);
  return engine;
}
