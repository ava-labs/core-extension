import { Runtime } from 'webextension-polyfill-ts';
import {
  extensionEventsHandler,
  extensionMessageHandler,
} from '../extensionController';
import { OnboardingPhase } from '../services/onboarding/models';
import { onboardingCurrentPhase } from '../services/onboarding/onboardingFlows';

export function extensionConnection(connection: Runtime.Port) {
  console.log('attempting to connect extension');

  const onMessageHandler = extensionMessageHandler(connection);
  const onEventsSubscription = extensionEventsHandler(connection).subscribe();

  connection.onMessage.addListener(onMessageHandler);

  connection.onDisconnect.addListener(function onDisconnectHandler() {
    connection.onMessage.removeListener(onMessageHandler);
    connection.onDisconnect.removeListener(onDisconnectHandler);
    onEventsSubscription.unsubscribe();
    onboardingCurrentPhase.next(OnboardingPhase.RESTART);
    console.log('extension disconnected and cleaned up');
  });
}
