import extension from "extensionizer";
import { Runtime } from "webextension-polyfill-ts";
import { Signal } from "micro-signals";
declare global {
  interface Window {
    avalanche: any;
  }
}

class AvalancheWeb3 {
  constructor() {}

  test() {
    return "test";
  }

  getAddress() {
    return "asdfasdfasasdf";
  }
}

export default new AvalancheWeb3();
