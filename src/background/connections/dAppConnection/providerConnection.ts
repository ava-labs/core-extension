import { connectionLog, disconnectLog, eventLog } from '@src/utils/logging';
import { providerConnectionHandlers } from './providerController';
import { providerEventsController } from './providerEventsController';

export function providerConnection(connection) {
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
