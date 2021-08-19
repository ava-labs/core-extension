import PortStream from 'extension-port-stream';
import { createWalletControllerStream } from './providerController';
import { createProviderUpdateStream } from './providerUpdates';
import logger, { LoggerColors } from '../../../utils/logging';
import pump from 'pump';
import { createTransformToJsonRPCResponse } from './providerUpdate';

export function providerConnection(connection) {
  const walletControllerStream = createWalletControllerStream();
  const stream = new PortStream(connection);

  /**
   * For any connection that is opened, we pipe the request into the wallet controller. The wallet
   * controller then gets the proper handler for that request and the response is piped out to the
   * original connection.
   */
  pump(
    stream,
    logger('Wallet controller request'),
    walletControllerStream,
    (err) => {
      /**
       * When a app refreshes the wallet connection stream throws a
       * `wallet controller stream error:  Error: premature close` I cant find much
       * info on this but it seems to be because the stream has been destroyed before
       * it was ended, or vice versa im not 100% on this. But it continues to work for now
       * so in the future would be nice to know why and fix it.
       */
      console.log('wallet controller stream error: ', err);
    }
  )
    .addListener('data', (result) => {
      connection.postMessage(result);
    })
    .addListener('close', () => {});

  const providerUpdateStream = createProviderUpdateStream();
  /**
   * When parts of the store update the provider needs to be notified. This is specified in the spec
   * @link https://eips.ethereum.org/EIPS/eip-1193
   *
   * Currently in the metamask architecture these events go through the same connection, there is then
   * middleware that intercepts and deciphers between of these events and the above messages. Depending
   * on wwhich one they determine it to be they either fire an event that bubbles up to the provider or they
   * resolve the value as a response to a prviously made json rpc request. This basically comes down to whether the
   * object contains an id or not.
   *
   * This middleware and logic can be found here:
   * @link https://github.com/MetaMask/json-rpc-middleware-stream/blob/main/src/createStreamMiddleware.ts
   *
   * Eventually we will move away from the above architecture but for now it works
   */
  pump(
    providerUpdateStream,
    createTransformToJsonRPCResponse(),
    logger('Wallet provider update', { color: LoggerColors.success }),
    (err) => {
      console.log('wallet updates stream error: ', err);
    }
  ).addListener('data', (result) => {
    connection.postMessage(result);
  });

  /**
   * When the connection closes we close one stream from each pump, this will then
   * disconnect the remaining streams.
   */
  function cleanupOnDisconnect() {
    providerUpdateStream.destroy();
    walletControllerStream.destroy();
    connection.onDisconnect.removeListener(cleanupOnDisconnect);
  }
  connection.onDisconnect.addListener(cleanupOnDisconnect);
}
