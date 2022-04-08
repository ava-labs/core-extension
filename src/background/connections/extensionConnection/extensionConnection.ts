import { Runtime } from 'webextension-polyfill-ts';
import {
  extensionEventsHandler,
  extensionMessageHandler,
} from './extensionController';
import { connectionLog, disconnectLog } from '@src/utils/logging';
import { unlockFromSessionStorage } from '@src/background/services/wallet/utils/unlockFromSessionStorage';

export async function extensionConnection(connection: Runtime.Port) {
  // make sure the service worker is authenticated if still in session before handling any requests
  await unlockFromSessionStorage();

  const onMessageHandler = extensionMessageHandler(connection);
  const onEventsSubscription = extensionEventsHandler(connection).subscribe();

  connectionLog('extension');
  connection.onMessage.addListener(onMessageHandler);

  connection.onDisconnect.addListener(function onDisconnectHandler() {
    connection.onMessage.removeListener(onMessageHandler);
    connection.onDisconnect.removeListener(onDisconnectHandler);
    onEventsSubscription.unsubscribe();
    disconnectLog('extension');
  });
}
