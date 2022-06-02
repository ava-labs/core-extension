import { JsonRpcEngine } from 'json-rpc-engine';
import { createFetchMiddleware } from 'eth-json-rpc-middleware';
import { Network } from '@avalabs/chains-sdk';

export { JsonRpcRequest } from 'json-rpc-engine';

export async function engine(network: Network) {
  const fetchMiddleware = createFetchMiddleware({
    get rpcUrl() {
      return network.rpcUrl;
    },
  });
  const engine = new JsonRpcEngine();
  engine.push(fetchMiddleware);
  return engine;
}
