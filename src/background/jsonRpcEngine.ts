import { JsonRpcEngine } from "json-rpc-engine";
import { createFetchMiddleware } from "eth-json-rpc-middleware";

const fetchMiddleware = createFetchMiddleware({
  rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
});
const engine = new JsonRpcEngine();
engine.push(fetchMiddleware);
export default engine;

export { JsonRpcRequest } from "json-rpc-engine";
