import { Runtime } from 'webextension-polyfill';
import { ConnectionController } from '../models';

export class KeepaliveConnectionController implements ConnectionController {
  private connection?: Runtime.Port;

  connect(connection: Runtime.Port) {
    this.connection = connection;
    this.connection.onMessage.addListener(this.onMessage);
    setTimeout(() => {
      connection.disconnect();
    }, 60000);
  }

  disconnect() {
    this.connection?.onMessage.removeListener(this.onMessage);
  }

  private onMessage(val: any) {
    console.log('KEEPALIVE MESSAGE', val);
  }
}
