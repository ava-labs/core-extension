import { Runtime } from 'webextension-polyfill';
import AbstractConnection from './AbstractConnection';
import { Message } from './models';

export default class PortConnection extends AbstractConnection {
  #port: Runtime.Port;

  constructor(port: Runtime.Port, concurrentRequestLimit = 1000) {
    super(concurrentRequestLimit);

    this.#port = port;
    this.#port.onDisconnect.addListener(() => {
      this.emit('disconnect');
    });
  }

  _connect = () => {
    this.#port.onMessage.addListener((message) => {
      return this.onMessage(message);
    });
  };

  _disconnect = () => {
    this.#port.disconnect();
  };

  _send = (message: Message) => {
    this.#port.postMessage(message);
  };
}
