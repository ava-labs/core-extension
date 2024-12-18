import AbstractConnection from './AbstractConnection';
import { Message } from './models';

const CHANNEL_BROADCAST_EVENT = 'initialize-post-message-connection';
const CHANNEL_BROADCAST_REQUEST_EVENT =
  'initialize-post-message-connection-request';

export default class AutoPairingPostMessageConnection extends AbstractConnection {
  #channel: Window;
  #connectionId?: string;
  #connectionReadyPromiseResolve?: (value: void | PromiseLike<void>) => void;
  #connectionReadyPromiseReject?: (value: void | PromiseLike<void>) => void;

  constructor(
    private isConnectionLeader: boolean,
    concurrentRequestLimit = 1000,
  ) {
    super(concurrentRequestLimit);

    this.#channel = window;

    if (this.isConnectionLeader) {
      this.#connectionId = `PM-Connection-${crypto.randomUUID()}`;

      this.#broadcastConnectionId();
    } else {
      this.#listenForConnectionNameBroadcast();
    }
  }

  #broadcastConnectionId = () => {
    const broadcast = () => {
      this.#channel.postMessage(
        {
          message: {
            type: CHANNEL_BROADCAST_EVENT,
            connectionId: this.#connectionId,
          },
        },
        window.location.origin,
      );
    };

    // boadcast connection id immediately when connection is initialized
    broadcast();

    // listen for requests from clients initialised after the connection leader
    this.#channel.addEventListener('message', (event) => {
      if (
        event.origin !== window.location.origin ||
        !event.data?.message ||
        event.data.message.type !== CHANNEL_BROADCAST_REQUEST_EVENT
      ) {
        return;
      }

      broadcast();
    });
  };

  #listenForConnectionNameBroadcast = () => {
    const handler = (event) => {
      if (
        event.origin !== window.location.origin ||
        !event.data?.message ||
        event.data.message.type !== CHANNEL_BROADCAST_EVENT
      ) {
        return;
      }

      this.#connectionId = event.data.message.connectionId;
      if (this.#connectionReadyPromiseResolve) {
        this.#connectionReadyPromiseResolve();
      }
    };

    this.#channel.addEventListener('message', handler);

    // request connection leader to announce the channel ID
    this.#channel.postMessage(
      {
        message: {
          type: CHANNEL_BROADCAST_REQUEST_EVENT,
        },
      },
      window.location.origin,
    );
  };

  #messageListener = ({ origin, data: { connectionId, message } }) => {
    // ignore cross origin messages and messages from other connections
    if (
      !this.#connectionId ||
      origin === 'null' ||
      origin !== window.location.origin ||
      connectionId !== this.#connectionId ||
      !message
    ) {
      return;
    }

    return this.onMessage(message);
  };

  _connect = async () => {
    this.#channel.addEventListener('message', this.#messageListener);
    if (this.#connectionId) {
      return;
    }

    // wait for connection ID if not already set
    return new Promise<void>((res, reject) => {
      this.#connectionReadyPromiseResolve = res;
      this.#connectionReadyPromiseReject = reject;
    });
  };

  _disconnect = () => {
    // reject pending connection if we have not received any connection ID till destruction
    if (!this.#connectionId && this.#connectionReadyPromiseReject) {
      this.#connectionReadyPromiseReject();
    }
    this.#channel.removeEventListener('message', this.#messageListener);
  };

  _send = (message: Message) => {
    if (!this.#connectionId) {
      return;
    }

    this.#channel.postMessage({
      connectionId: this.#connectionId,
      message,
    });
  };
}
