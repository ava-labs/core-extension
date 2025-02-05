import type { Runtime } from 'webextension-polyfill';
import AbstractConnection from './AbstractConnection';
import type { Message } from './models';
import { serializeToJSON } from '@src/background/serialization/serialize';
import { deserializeFromJSON } from '@src/background/serialization/deserialize';

export default class PortConnection extends AbstractConnection {
  #port: Runtime.Port;

  constructor(port: Runtime.Port, concurrentRequestLimit = 1000) {
    super(concurrentRequestLimit);

    this.#port = port;
    this.#port.onDisconnect.addListener(() => {
      this.emit('disconnect');
    });
  }

  _connect = async () => {
    this.#port.onMessage.addListener((message: string) => {
      const deserialised = deserializeFromJSON<Message>(message);
      return deserialised && this.onMessage(deserialised);
    });
  };

  _disconnect = () => {
    this.#port.disconnect();
  };

  _send = (message: Message) => {
    // we need to serialize some values that the browser does not know how to handle,
    // but still pass the message forward as an object (not a JSON string)
    this.#port.postMessage(serializeToJSON(message));
  };
}
