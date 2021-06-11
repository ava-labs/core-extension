import { JsonRpcRequest } from "json-rpc-engine";

export default {
  getHandlerForKey(data: JsonRpcRequest<any>) {
    return this[data.method];
  },
};
