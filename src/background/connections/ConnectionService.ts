import browser, { Runtime } from 'webextension-polyfill';
import extension from 'extensionizer';
import {
  CONTENT_SCRIPT,
  EXTENSION_SCRIPT,
  KEEPALIVE_SCRIPT,
} from '@src/common';
import { container, singleton } from 'tsyringe';
import { DAppConnectionController } from './dAppConnection/DAppConnectionController';
import { ConnectionController } from './models';
import { KeepaliveConnectionController } from './keepaliveConnection/KeepaliveConnectionController';
import { ExtensionConnectionController } from './extensionConnection/ExtensionConnectionController';

@singleton()
export class ConnectionService {
  activate() {
    browser.runtime.onConnect.addListener((connection) => {
      this.handleConnection(connection);
    });
  }

  private handleConnection(connection: Runtime.Port) {
    /**
     * we only want connection from the parent app, that is frameId = 0
     *
     * If it doesnt have a frameid then its the extension popup itself
     */
    if (connection.sender?.frameId && connection.sender?.frameId !== 0) {
      return;
    }

    if (connection.sender?.id !== extension.runtime.id) {
      return;
    }

    let connectionController: ConnectionController | null = null;
    if (connection.name === EXTENSION_SCRIPT) {
      connectionController = container.resolve(ExtensionConnectionController);
    } else if (connection.name === CONTENT_SCRIPT) {
      connectionController = container.resolve(DAppConnectionController);
    } else if (connection.name === KEEPALIVE_SCRIPT) {
      connectionController = container.resolve(KeepaliveConnectionController);
    }

    connectionController?.connect(connection);
  }
}
