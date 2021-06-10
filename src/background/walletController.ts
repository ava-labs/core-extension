import { Duplex } from "stream";
import providerHandlers from "./providerHandlers";
import web3Handlers from "./web3Handlers";
import { JsonRpcRequest } from "./jsonRpcEngine";
import { resolve } from "../utils/promiseResolver";
export class WalletController {
  /**
   * Check if a handler exists, make sure it only exists in one handler provider.
   * @param data
   * @returns
   */
  private getRequestHandler(data: JsonRpcRequest<any>) {
    const providerHandler = providerHandlers.getHandlerForKey(data);
    const web3Handler = web3Handlers.getHandlerForKey(data);
    if (!providerHandler && !web3Handler) {
      return () =>
        Promise.reject(`the rpc method ${data.method} is not supported`);
    } else if (providerHandler && web3Handler) {
      return () =>
        Promise.reject(
          `the rpc method ${data.method} is supported by multiple handlers`
        );
    } else {
      return providerHandler || web3Handler;
    }
  }

  async mapChunkToHandler(request) {
    const handler = this.getRequestHandler(request.data);
    const [result, err] = await resolve(handler(request.data));
    return result
      ? { ...request, data: result }
      : { ...request, data: { ...request.data, error: err } };
  }
}

export class WalletControllerStream extends Duplex {
  controller = new WalletController();

  constructor() {
    super({ objectMode: true });
  }

  _read() {}

  _write(chunk, _encoding, cb) {
    this.controller
      .mapChunkToHandler(chunk)
      .then((result) => {
        this.push(result);
      })
      .finally(() => cb());
  }

  _final() {
    this.push(null);
  }
}
