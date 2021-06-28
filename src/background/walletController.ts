import { Duplex } from 'stream';
import providerHandlers from './rpc/providerHandlers';
import web3Handlers from './rpc/web3Handlers';
import { JsonRpcRequest } from './rpc/jsonRpcEngine';
import { resolve } from '../utils/promiseResolver';

/**
 * This is the core of the background logic. Every request comes in through the WalletControllerStream
 * _write method. That method then offloads the handling to the WalletController. The result is then
 * piped back down into the stream and sent out to its respective client.
 */
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
export function createWalletControllerStream() {
  const controller = new WalletController();
  return new Duplex({
    objectMode: true,
    write(chunk, _encoding, cb) {
      controller
        .mapChunkToHandler(chunk)
        .then((result) => {
          this.push(result);
        })
        .finally(() => cb());
    },
    read() {
      return;
    },
  });
}
