import extension from "extensionizer";
import PortStream from "extension-port-stream";
import { AvalancheBackgroundConnection } from "./avalancheBackgroundConnection";

declare global {
  interface Window {
    avalanche: Avalanche;
  }
}

class Avalanche {
  private backgroundConnection = new AvalancheBackgroundConnection();
  constructor() {
    window.avalanche = this;
  }

  test() {
    return "test";
  }

  getAddress() {
    return "asdfasdfasasdf";
  }
}
