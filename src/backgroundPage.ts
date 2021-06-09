import { browser } from "webextension-polyfill-ts";
import PortStream from "extension-port-stream";
import walletControllerStream from "./background/walletController";
import logger from "./background/logging";
import pump from "pump";

const value = 1;
browser.runtime.onConnect.addListener((connection) => {
  console.log("connected: ", connection);
  // is this coming from the controller
  // or is this the dApp
  const stream = new PortStream(connection);

  pump(
    stream,
    logger("Wallet controller request"),
    walletControllerStream,
    logger("Wallet controller response"),
    (err) => {
      console.log("wallet controller stream error: ", err);
    }
  ).addListener("data", (result) => {
    connection.postMessage(result);
  });
});
