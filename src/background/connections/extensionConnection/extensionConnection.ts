import { Runtime } from 'webextension-polyfill-ts';
import {
  extensionEventsHandler,
  extensionMessageHandler,
} from './extensionController';
import { OnboardingPhase } from '../../services/onboarding/models';
import { onboardingCurrentPhase } from '../../services/onboarding/onboardingFlows';
import { connectionLog, disconnectLog } from '@src/utils/logging';

export function extensionConnection(connection: Runtime.Port) {
  const onMessageHandler = extensionMessageHandler(connection);
  const onEventsSubscription = extensionEventsHandler(connection).subscribe();

  connectionLog('extension');
  connection.onMessage.addListener(onMessageHandler);

  connection.onDisconnect.addListener(function onDisconnectHandler() {
    connection.onMessage.removeListener(onMessageHandler);
    connection.onDisconnect.removeListener(onDisconnectHandler);
    onEventsSubscription.unsubscribe();
    onboardingCurrentPhase.next(OnboardingPhase.RESTART);
    disconnectLog('extension');
  });
}
