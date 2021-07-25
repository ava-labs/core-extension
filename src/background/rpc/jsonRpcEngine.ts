import { JsonRpcEngine } from 'json-rpc-engine';
import { createFetchMiddleware } from 'eth-json-rpc-middleware';
import { getNetworkFromStorage } from '@src/contexts/NetworkProvider';

export { JsonRpcRequest } from 'json-rpc-engine';

export async function engine() {
  const network = await getNetworkFromStorage();
  const fetchMiddleware = createFetchMiddleware({
    get rpcUrl() {
      return network.config.rpcUrl.c;
    },
  });
  const engine = new JsonRpcEngine();
  engine.push(fetchMiddleware);
  return engine;
}
