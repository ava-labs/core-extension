import { JsonRpcEngine } from 'json-rpc-engine';
import { createFetchMiddleware } from 'eth-json-rpc-middleware';
import { store } from '@src/store/store';
import { isFujiNetwork } from '@src/store/network/networkStore';

const fetchMiddleware = createFetchMiddleware({
  get rpcUrl() {
    /**
     * TODO: @link https://ava-labs.atlassian.net/browse/PM-219
     * clean up env config like this and centralize all of this
     */
    return isFujiNetwork(store.networkStore.network)
      ? 'https://api.avax-test.network/ext/bc/C/rpc'
      : ' https://api.avax.network/ext/bc/C/rpc';
  },
});

const engine = new JsonRpcEngine();
engine.push(fetchMiddleware);
export default engine;

export { JsonRpcRequest } from 'json-rpc-engine';
