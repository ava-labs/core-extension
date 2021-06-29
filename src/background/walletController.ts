import { Duplex } from 'stream';
import providerHandlers from './rpc/providerHandlers';
import web3Handlers from './rpc/web3Handlers';
import { JsonRpcRequest } from './rpc/jsonRpcEngine';
import { resolve } from '../utils/promiseResolver';
import { PermissionsController } from './permissionsController';

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
  const permissions = new PermissionsController();

  return new Duplex({
    objectMode: true,
    write(chunk, _encoding, cb) {
      permissions
        /**
         * Since the domain comes from the provider we watch for that here. Soon as
         * we get the rpc request we broadcas that out to all requests that require
         * permissions, permissions are by domain and this is how we find out what domain
         * they are coming from.
         *
         */
        .watchForDomainAndDispatch(chunk.data)
        .validateMethodPermissions(chunk.data)
        .then((data) => controller.mapChunkToHandler({ ...chunk, data }))
        .then((result) => {
          this.push(result);
        });

      cb();
    },
    read() {
      return;
    },
    destroy() {
      permissions.destroy();
    },
  });
}
