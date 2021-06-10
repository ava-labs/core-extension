import { browser } from "webextension-polyfill-ts";
import PortStream from "extension-port-stream";
import { WalletControllerStream } from "./background/walletController";
import logger from "./background/logging";
import pump from "pump";
import {
  addConnection,
  connectionExists,
  removeConnection,
} from "./background/portConnectionsManager";

browser.runtime.onConnect.addListener((connection) => {
  // is this coming from the controller
  // or is this the dApp

  if (connectionExists(connection)) {
    console.log("already connected: ", connection);
    return;
  } else {
    // we only want connection from the parent app, that is frameId = 0
    if (connection.sender?.frameId === 0) {
      console.log("connected: ", connection);
      addConnection(connection);
    }
  }

  const walletControllerStream = new WalletControllerStream();
  const stream = new PortStream(connection);

  pump(
    stream,
    logger("Wallet controller request"),
    walletControllerStream,
    logger("Wallet controller response"),
    (err) => {
      console.log("wallet controller stream error: ", err);
      removeConnection(connection)?.disconnect();
    }
  )
    .addListener("data", (result) => {
      connection.postMessage(result);
    })
    .addListener("close", () => {
      console.log(
        "called close: ",
        stream.destroyed,
        walletControllerStream.destroyed
      );
      removeConnection(connection)?.disconnect();
    });
});
