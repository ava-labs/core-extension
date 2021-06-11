import { JsonRpcEngine } from "json-rpc-engine";
import { createFetchMiddleware } from "eth-json-rpc-middleware";
import { store } from "../../store/store";

const fetchMiddleware = createFetchMiddleware({
  rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
});

console.log("walletStore: ", store.walletStore);
const engine = new JsonRpcEngine();
engine.push(fetchMiddleware);
export default engine;

export { JsonRpcRequest } from "json-rpc-engine";
