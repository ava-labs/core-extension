import extension from "extensionizer";
import { Runtime } from "webextension-polyfill-ts";
import { Signal } from "micro-signals";

const backgroundConnection: Runtime.Port = extension.runtime.connect({
  name: "background",
});

export class AvalancheBackgroundConnection {
  private onMessage = new Signal();
  constructor() {
    backgroundConnection.onMessage.addListener((evt: any) => {
      // do someting
      this.onMessage.dispatch(evt);
    });
  }
}
