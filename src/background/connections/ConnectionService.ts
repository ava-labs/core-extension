import browser, { Runtime } from 'webextension-polyfill';
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
import { CallbackManager } from '../runtime/CallbackManager';

@singleton()
export class ConnectionService {
  private _extensionsOpened = 0;

  constructor(private callbackManager: CallbackManager) {}

  activate() {
    browser.runtime.onConnect.addListener((connection) => {
      const controller = this.handleConnection(connection);

      if (controller instanceof ExtensionConnectionController) {
        this._extensionsOpened += 1;
        connection.onDisconnect.addListener(() => this.handleExtensionClosed());
      }
    });
  }

  private handleExtensionClosed() {
    this._extensionsOpened = Math.max(0, this._extensionsOpened - 1); // Safe guard from going below 0.

    if (this._extensionsOpened === 0) {
      this.callbackManager.onAllExtensionsClosed();
    }
  }

  private handleConnection(connection: Runtime.Port) {
    if (connection.sender?.id !== browser.runtime.id) {
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

    return connectionController;
  }
}
