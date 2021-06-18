import { browser } from "webextension-polyfill-ts";
import PortStream from "extension-port-stream";
import { createWalletControllerStream } from "./background/walletController";
import logger from "./background/utils/logging";
import pump from "pump";
import {
  addConnection,
  connectionExists,
  removeConnection,
} from "./background/utils/portConnectionsManager";
import { store } from "@src/store/store";

console.log("walletStore: ", store.walletStore);

browser.runtime.onConnect.addListener((connection) => {
  if (connectionExists(connection)) {
    console.log("already connected: ", connection);
    return;
  } else {
    // we only want connection from the parent app, that is frameId = 0
    if (connection.sender?.frameId === 0) {
      console.log("connecting: ", connection);
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
    logger("Wallet controller request"),
    walletControllerStream,
    logger("Wallet controller response"),
    (err) => {
      /**
       * When a app refreshes the wallet connection stream throws a
       * `wallet controller stream error:  Error: premature close` I cant find much
       * info on this but it seems to be because the stream has been destroyed before
       * it was ended, or vice versa im not 100% on this. But it continues to work for now
       * so in the future would be nice to know why and fix it.
       */
      console.log("wallet controller stream error: ", err);
      removeConnection(connection)?.disconnect();
    }
  )
    .addListener("data", (result) => {
      connection.postMessage(result);
    })
    .addListener("close", () => {
      removeConnection(connection)?.disconnect();
    });
});
