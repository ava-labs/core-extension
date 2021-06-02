import { browser } from "webextension-polyfill-ts";
import PortStream from "extension-port-stream";

browser.runtime.onConnect.addListener((connection) => {
  console.log("on connect attempt: ", connection);
  // new PortStream(connection).emit("ev", "Back at you :)");
  connection.postMessage({ message: "back to ya :)" });

  connection.onMessage.addListener((...args) => {
    console.log("this is from foreground: ", args);
  });
});
// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((...args) => {
  // browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
  // Log statement if request.popupMounted is true
  // NOTE: this request is sent in `popup/component.tsx`
  console.log("made it", args);
  // if (request.popupMounted) {
  //   console.log("backgroundPage notified that Popup.tsx has mounted.");
  // }
});
