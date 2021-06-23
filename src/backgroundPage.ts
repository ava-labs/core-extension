import { browser, Runtime } from 'webextension-polyfill-ts';
import PortStream from 'extension-port-stream';
import { createWalletControllerStream } from './background/walletController';
import { createProviderUpdateStream } from './background/walletUpdates';
import logger, { LoggerColors } from './background/utils/logging';
import pump from 'pump';
import {
  addConnection,
  connectionExists,
  removeConnection,
} from './background/utils/portConnectionsManager';
import { createTransformToJsonRPCResponse } from './background/utils/providerUpdate';
import { extension } from 'extensionizer';
import { openExtensionInBrowser } from '@src/utils/extensionUtils';

browser.runtime.onConnect.addListener((connection) => {
  if (connectionExists(connection)) {
    console.log('already connected: ', connection);
    return;
  } else {
    // we only want connection from the parent app, that is frameId = 0
    if (connection.sender?.frameId === 0) {
      console.log('connecting: ', connection);
      addConnection(connection);
    }
  }

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
    logger('Wallet controller response', { color: LoggerColors.success }),
    (err) => {
      /**
       * When a app refreshes the wallet connection stream throws a
       * `wallet controller stream error:  Error: premature close` I cant find much
       * info on this but it seems to be because the stream has been destroyed before
       * it was ended, or vice versa im not 100% on this. But it continues to work for now
       * so in the future would be nice to know why and fix it.
       */
      console.log('wallet controller stream error: ', err);
      removeConnection(connection)?.disconnect();
    }
  )
    .addListener('data', (result) => {
      connection.postMessage(result);
    })
    .addListener('close', () => {
      removeConnection(connection)?.disconnect();
    });

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
   * When the connection closes we close one stream from each pump, will will then
   * disconnect the remaining streams.
   */
  function cleanupOnDisconnect() {
    providerUpdateStream.destroy();
    walletControllerStream.destroy();
    connection.onDisconnect.removeListener(cleanupOnDisconnect);
  }
  connection.onDisconnect.addListener(cleanupOnDisconnect);
});

// On first install, open a new tab
// commented out during dev
// extension.runtime.onInstalled.addListener((x: extension) => {
//   const reason: Runtime.OnInstalledReason = x.reason;

//   if (reason === 'install') {
//     openExtensionInBrowser();
//   }
// });
