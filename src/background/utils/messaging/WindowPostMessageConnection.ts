import AbstractConnection from './AbstractConnection';
import { Message } from './models';

export default class WindowPostMessageConnection extends AbstractConnection {
  #channel: Window;

  constructor(private name: string, concurrentRequestLimit = 1000) {
    super(concurrentRequestLimit);

    this.#channel = window;
  }

  #messageListener = ({ origin, data: { connectionName, message } }) => {
    // ignore cross origin messages and messages from other connections
    if (origin !== window.location.origin || connectionName !== this.name) {
      return;
    }

    return this.onMessage(message);
  };

  _connect = () => {
    this.#channel.addEventListener('message', this.#messageListener);
  };

  _disconnect = () => {
    this.#channel.removeEventListener('message', this.#messageListener);
  };

  _send = (message: Message) => {
    this.#channel.postMessage({
      connectionName: this.name,
      message,
    });
  };
}
