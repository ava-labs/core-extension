import { JsonRpcEngine } from 'json-rpc-engine';
import { createFetchMiddleware } from 'eth-json-rpc-middleware';
import { firstValueFrom } from 'rxjs';
import { network$ } from '@avalabs/wallet-react-components';

export { JsonRpcRequest } from 'json-rpc-engine';

export async function engine() {
  const net = await firstValueFrom(network$);
  const fetchMiddleware = createFetchMiddleware({
    get rpcUrl() {
      return net.config.rpcUrl.c;
    },
  });
  const engine = new JsonRpcEngine();
  engine.push(fetchMiddleware);
  return engine;
}
