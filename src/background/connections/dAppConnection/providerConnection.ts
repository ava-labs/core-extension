import { unlockFromSessionStorage } from '@src/background/services/wallet/utils/unlockFromSessionStorage';
import { connectionLog, disconnectLog, eventLog } from '@src/utils/logging';
import { providerConnectionHandlers } from './providerController';
import { providerEventsController } from './providerEventsController';

export async function providerConnection(connection) {
  // make sure the service worker is authenticated if still in session before handling any requests
  await unlockFromSessionStorage();

  const onMessageHandler = providerConnectionHandlers(connection);
  const eventsSubscription = providerEventsController(connection).subscribe(
    (evt) => eventLog('Web 3 Event', evt)
  );

  connectionLog('dApp Provider');

  connection.onMessage.addListener(onMessageHandler);

  connection.onDisconnect.addListener(function onDisconnectHandler() {
    connection.onMessage.removeListener(onMessageHandler);
    connection.onDisconnect.removeListener(onDisconnectHandler);
    eventsSubscription.unsubscribe();
    disconnectLog('dApp Provider');
  });
}
