import AbstractConnection from './AbstractConnection';
import { Message } from './models';

export default class BroadcastChannelConnection extends AbstractConnection {
  #channel: BroadcastChannel;

  constructor(name: string, concurrentRequestLimit = 1000) {
    super(concurrentRequestLimit);

    this.#channel = new BroadcastChannel(name);
  }

  _connect = () => {
    this.#channel.onmessage = ({ data: message }) => {
      return this.onMessage(message);
    };
  };

  _disconnect = () => {
    this.#channel.close();
  };

  _send = (message: Message) => {
    this.#channel.postMessage(message);
  };
}
